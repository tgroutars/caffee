const Router = require('koa-router');
const pick = require('lodash/pick');

const { APIError } = require('./errors');
const { requireAuth, requireAdmin, findProduct } = require('./middleware');
const { Product, ProductUser } = require('../../models');
const { Product: ProductService } = require('../../services');
const { listBoards } = require('../../integrations/trello/helpers/api');

const router = new Router();

const serializeProduct = product => ({
  ...pick(product, [
    'id',
    'name',
    'image',
    'questions',
    'userRole',
    'trelloBoardId',
  ]),
  roadmapStages: product.roadmapStages
    ? product.roadmapStages.map(stage => pick(stage, 'id', 'name', 'position'))
    : undefined,
  tags: product.tags
    ? product.tags.map(tag => pick(tag, 'id', 'name'))
    : undefined,
});

router.post('/products.info', requireAuth, findProduct, async ctx => {
  const { product } = ctx.state;
  await product.reload({ include: ['roadmapStages', 'tags'] });
  ctx.send({ product: serializeProduct(product) });
});

router.post('/products.list', requireAuth, async ctx => {
  const { user } = ctx.state;
  const productUsers = await ProductUser.findAll({
    where: { userId: user.id },
    include: ['product'],
  });
  const products = productUsers.map(productUser =>
    serializeProduct({
      ...productUser.product.dataValues,
      userRole: productUser.role,
    }),
  );
  ctx.send({ products });
});

router.post(
  '/products.setQuestions',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { questions } = ctx.request.body;
    const { product } = ctx.state;
    await ProductService.setQuestions(product.id, questions);
    const updatedProduct = await Product.findById(product.id);
    ctx.send({ product: serializeProduct(updatedProduct) });
  },
);

router.post(
  '/products.listTrelloBoards',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { product } = ctx.state;
    const { trelloAccessToken } = product;
    if (!trelloAccessToken) {
      throw new APIError('trello_not_connected');
    }
    const boards = await listBoards(trelloAccessToken);
    ctx.send({ boards: boards.map(({ id, name }) => ({ id, name })) });
  },
);

router.post(
  '/products.setTrelloBoard',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { product } = ctx.state;
    const { boardId } = ctx.request.body;
    await ProductService.setTrelloBoard(product.id, boardId);
    await product.reload({ include: ['roadmapStages', 'tags'] });
    ctx.send({ product: serializeProduct(product) });
  },
);

module.exports = router;
