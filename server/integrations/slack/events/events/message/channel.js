const { SlackUser, ProductUser, Sequelize } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

const { Op } = Sequelize;

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const channelMessage = async (payload, { workspace }) => {
  const {
    event: { text, channel, user: userSlackId },
  } = payload;

  const { accessToken, appUserId } = workspace;

  const products = await workspace.getProducts();

  const appMention = `<@${appUserId}>`;
  if (!text.includes(appMention)) {
    return;
  }

  if (!products.length) {
    return;
  }

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId, workspaceId: workspace.id },
  });
  const re = new RegExp(`\\s*?${appMention}\\s*?`, 'g');
  const defaultText = text.replace(re, ' ');

  if (products.length > 1) {
    await postMenuChooseProductMessage({
      products,
      defaultText,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel, user: userSlackId });
    return;
  }

  const product = products[0];

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId: product.id,
      role: { [Op.in]: ['user', 'admin'] },
    },
  });

  await postMenuMessage({
    defaultText,
    defaultAuthorId: slackUser.userId,
    productId: products[0].id,
    createBacklogItem: !!productUser,
  })({ accessToken, channel, user: userSlackId });
};

module.exports = channelMessage;
