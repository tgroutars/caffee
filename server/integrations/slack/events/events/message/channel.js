const { SlackWorkspace, SlackUser } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const channelMessage = async payload => {
  const {
    team_id: workspaceSlackId,
    event: { text, channel, user: userSlackId },
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

  await postMenuMessage({
    defaultText,
    defaultAuthorId: slackUser.userId,
    productId: products[0].id,
  })({ accessToken, channel, user: userSlackId });
};

module.exports = channelMessage;
