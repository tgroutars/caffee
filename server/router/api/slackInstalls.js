const Router = require('koa-router');
const pick = require('lodash/pick');
const SlackClient = require('@slack/client').WebClient;

const { APIError } = require('./errors');
const { requireAuth, findProduct, requireAdmin } = require('./middleware');
const { SlackInstall, Product, ProductUser } = require('../../models');
const { SlackInstall: SlackInstallService } = require('../../services');

const router = new Router();

const serializeSlackInstall = slackInstall => ({
  ...pick(slackInstall, ['id', 'channel']),
  ...pick(slackInstall.workspace, [
    'name',
    'image',
    'slackId',
    'name',
    'domain',
    'image',
  ]),
});

const findSlackInstall = async (ctx, next) => {
  const { user } = ctx.state;
  const { slackInstallId } = ctx.request.body;
  const slackInstall = await SlackInstall.findById(slackInstallId, {
    include: ['workspace'],
  });
  if (!slackInstall) {
    throw new APIError('slack_install_not_found');
  }
  const product = await Product.find({
    where: { id: slackInstall.productId },
    include: [
      { model: ProductUser, as: 'productUsers', where: { userId: user.id } },
    ],
  });
  const [productUser] = product.productUsers;
  ctx.state.product = product;
  ctx.state.productUser = productUser;
  ctx.state.slackInstall = slackInstall;
  await next();
};

router.post(
  '/slackInstalls.list',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { product } = ctx.state;
    const slackInstalls = await SlackInstall.findAll({
      where: { productId: product.id },
      include: ['workspace'],
    });
    ctx.send({ slackInstalls: slackInstalls.map(serializeSlackInstall) });
  },
);

router.post(
  '/slackInstalls.listChannels',
  requireAuth,
  findSlackInstall,
  requireAdmin,
  async ctx => {
    const { slackInstall } = ctx.state;
    const { workspace } = slackInstall;
    const { accessToken } = workspace;
    const slackClient = new SlackClient(accessToken);
    const { channels } = await slackClient.conversations.list();
    ctx.send({ channels: channels.map(({ id, name }) => ({ id, name })) });
  },
);

router.post(
  '/slackInstalls.setChannel',
  requireAuth,
  findSlackInstall,
  requireAdmin,
  async ctx => {
    const { slackInstall } = ctx.state;
    const { channel } = ctx.request.body;
    await SlackInstallService.setChannel(slackInstall.id, { channel });
    await slackInstall.reload({ include: ['workspace'] });
    ctx.send({ slackInstall: serializeSlackInstall(slackInstall) });
  },
);

module.exports = router;
