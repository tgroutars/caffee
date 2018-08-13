const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, requireAdmin, findProduct } = require('./middleware');
const { Product } = require('../../models');
const { Product: ProductService } = require('../../services');

const router = new Router();

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
