const SlackClient = require('@slack/client').WebClient;

const { SlackUser, ProductUser, Sequelize } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const getTitleDescription = require('../../../../../lib/getTitleDescription');

const { Op } = Sequelize;

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const channelMessage = async (payload, { workspace }) => {
  const {
    event: { text, channel, thread_ts: threadTS, user: userSlackId },
  } = payload;

  const { accessToken, appUserId } = workspace;

  const appMention = `<@${appUserId}>`;
  if (!text.includes(appMention)) {
    return;
  }

  const products = await workspace.getProducts();
  if (!products.length) {
    return;
  }

  let defaultText;
  if (threadTS) {
    const slackClient = new SlackClient(accessToken);
    const {
      messages: [message],
    } = await slackClient.conversations.history({
      channel,
      latest: threadTS,
      limit: 2,
      inclusive: true,
    });
    defaultText = message.text;
  } else {
    const re = new RegExp(`\\s*?${appMention}\\s*?`, 'g');
    defaultText = text.replace(re, ' ');
  }

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId, workspaceId: workspace.id },
  });

  const { title, description } = getTitleDescription(defaultText);

  if (products.length > 1) {
    await postMenuChooseProductMessage({
      products,
      defaultFeedback: defaultText,
      defaultBacklogItemTitle: title,
      defaultBacklogItemDescription: description,
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
    defaultFeedback: defaultText,
    defaultBacklogItemTitle: title,
    defaultBacklogItemDescription: description,
    defaultAuthorId: slackUser.userId,
    productId: products[0].id,
    createBacklogItem: !!productUser,
  })({ accessToken, channel, user: userSlackId });
};

module.exports = channelMessage;
