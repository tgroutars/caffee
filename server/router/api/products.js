const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, requireAdmin } = require('./middleware');
const { Product, ProductUser } = require('../../models');
const { Product: ProductService } = require('../../services');
const { APIError } = require('./errors');

const router = new Router();

const findProduct = async (ctx, next) => {
  const { productId } = ctx.request.body;
  const { user } = ctx.state;
  const product = await Product.findById(productId, {
    include: [
      {
        model: ProductUser,
        as: 'productUsers',
        where: {
          userId: user.id,
          role: 'admin',
        },
      },
    ],
  });
  if (!product) {
    throw new APIError('product_not_found');
  }
  ctx.state.product = product;
  await next();
};

const serializeProduct = product =>
  pick(product, ['id', 'name', 'image', 'questions']);

router.post('/products.info', requireAuth, findProduct, async ctx => {
  const { product } = ctx.state;
  ctx.send({ product: serializeProduct(product) });
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
