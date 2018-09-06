const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, requireAdmin, findProduct } = require('./middleware');
const { ProductUser } = require('../../models');

const router = new Router();

const serializeProductUser = productUser => ({
  ...pick(productUser.user, ['id', 'name', 'image']),
  ...pick(productUser, ['role']),
});

router.post(
  '/products.users.list',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { product } = ctx.state;
    const productUsers = await ProductUser.findAll({
      where: { productId: product.id },
      include: ['user'],
    });
    ctx.send({ users: productUsers.map(serializeProductUser) });
  },
);

module.exports = router;
