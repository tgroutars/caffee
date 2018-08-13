const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth } = require('./middleware');
const { Product, ProductUser } = require('../../models');
const { APIError } = require('./errors');

const router = new Router();

router.post('/products.info', requireAuth, async ctx => {
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

  ctx.send({ product: pick(product, ['id', 'name', 'image']) });
});

module.exports = router;
