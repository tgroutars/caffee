const Router = require('koa-router');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const { requireAuth, requireAdmin, findProduct } = require('./middleware');
const {
  ProductUser,
  SlackUser,
  SlackInstall,
  User,
  Sequelize,
} = require('../../models');
const { Product: ProductService } = require('../../services');

const { Op } = Sequelize;

const router = new Router();

const serializeProductUser = productUser => ({
  ...pick(productUser.user, ['id', 'name', 'image']),
  ...pick(productUser, ['role']),
});
const serializeUser = user => ({
  ...pick(user, ['id', 'name', 'image']),
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

router.post(
  '/products.users.add',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { product } = ctx.state;
    const { userId } = ctx.request.body;
    const productUser = await ProductService.addUser(product.id, userId);
    await productUser.reload({ include: ['user'] });
    ctx.send({ user: serializeProductUser(productUser) });
  },
);

router.post(
  '/products.users.getSuggestions',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { product } = ctx.state;
    const [slackInstalls, productUsers] = await Promise.all([
      SlackInstall.findAll({
        where: { productId: product.id },
      }),
      ProductUser.findAll({
        where: { productId: product.id },
      }),
    ]);
    const workspaceIds = slackInstalls.map(({ workspaceId }) => workspaceId);
    const existingUserIds = productUsers.map(({ userId }) => userId);
    const suggestedUsers = await User.findAll({
      where: { id: { [Op.notIn]: existingUserIds } },
      include: [
        {
          model: SlackUser,
          as: 'slackUsers',
          where: { workspaceId: { [Op.in]: workspaceIds } },
          required: true,
        },
      ],
    });

    ctx.send({ users: suggestedUsers.map(serializeUser) });
  },
);

module.exports = router;
