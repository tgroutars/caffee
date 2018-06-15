const { SlackWorkspace } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const channelMessage = async payload => {
  const {
    team_id: workspaceSlackId,
    event: { text, channel, user },
  } = payload;

  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['products'],
  });
  const { products, accessToken, appUserId } = workspace;

  const appMention = `<@${appUserId}>`;
  if (!text.includes(appMention)) {
    return;
  }

  if (!products.length) {
    return;
  }
  if (products.length > 1) {
    await postMenuChooseProductMessage({
      products,
    })({ accessToken, channel });
    return;
  }

  const re = new RegExp(`\\s*?${appMention}\\s*?`, 'g');
  const defaultFeedback = text.replace(re, ' ');
  await postMenuMessage({
    defaultFeedback,
    productId: products[0].id,
  })({ accessToken, channel, user });
};

module.exports = channelMessage;
