const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, requireAdmin, findProduct } = require('./middleware');
const { Product, ProductUser } = require('../../models');
const { Product: ProductService } = require('../../services');

const router = new Router();

const serializeProduct = product => ({
  ...pick(product, ['id', 'name', 'image', 'questions', 'userRole']),
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

module.exports = router;
