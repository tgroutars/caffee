const uniqBy = require('lodash/uniqBy');

const { Product, SlackWorkspace, SlackUser } = require('../../../models');
const { postEphemeral } = require('../messages');

const postChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const caffee = async ({ workspaceSlackId, channel, userSlackId, text }) => {
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['installs'],
  });
  const { accessToken } = workspace;

  const installs = uniqBy(workspace.installs, ({ productId }) => productId);

  if (!installs.length) {
    return;
  }

  const slackUser = await SlackUser.find({ where: { slackId: userSlackId } });
  if (installs.length > 1) {
    const products = await Product.findAll({
      where: {
        id: installs.map(({ productId }) => productId),
      },
    });

    await postChooseProductMessage({
      products,
      defaultText: text,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel, user: userSlackId });
    return;
  }

  const install = installs[0];
  const { productId } = install;

  await postMenuMessage({
    productId,
    defaultText: text,
    defaultAuthorId: slackUser.userId,
  })({
    accessToken,
    channel,
    user: userSlackId,
  });
};

module.exports = caffee;
