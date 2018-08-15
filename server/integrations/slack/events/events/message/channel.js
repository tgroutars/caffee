const SlackClient = require('@slack/client').WebClient;
const trim = require('lodash/trim');

const { SlackUser, ProductUser } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const getTitleDescription = require('../../../../../lib/getTitleDescription');
const { decode } = require('../../../helpers/encoding');
const { passwordlessURL } = require('../../../../../lib/auth');

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const channelMessage = async (payload, { workspace }) => {
  const { event } = payload;
  const {
    channel,
    files: messageFiles,
    thread_ts: threadTS,
    user: userSlackId,
  } = event;
  const rawText = event.text || '';

  const { accessToken, appUserId } = workspace;

  const appMention = `<@${appUserId}>`;
  if (!rawText.includes(appMention)) {
    return;
  }
  const appMentionRE = new RegExp(`\\s*?${appMention}\\s*?`, 'g');
  const text = trim(
    await decode(workspace)(rawText.replace(appMentionRE, ' ')),
  );

  const products = await workspace.getProducts();
  if (!products.length) {
    return;
  }

  let files;
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
    files = message.files || [];
  } else {
    defaultText = text;
    files = messageFiles;
  }

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId, workspaceId: workspace.id },
  });
  const {
    title: defaultTitle,
    description: defaultDescription,
  } = getTitleDescription(defaultText);

  if (products.length > 1) {
    await postMenuChooseProductMessage({
      products,
      files,
      defaultFeedback: defaultText,
      defaultRoadmapItemTitle: defaultTitle,
      defaultRoadmapItemDescription: defaultDescription,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel, user: userSlackId });
    return;
  }

  const product = products[0];

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId: product.id,
    },
  });

  await postMenuMessage({
    files,
    defaultFeedback: defaultText,
    defaultRoadmapItemTitle: defaultTitle,
    defaultRoadmapItemDescription: defaultDescription,
    defaultAuthorId: slackUser.userId,
    productId: products[0].id,
    createRoadmapItem: productUser.isPM,
    settingsURL: productUser.isAdmin
      ? await passwordlessURL(slackUser.userId, { productId: product.id })
      : null,
  })({ accessToken, channel, user: userSlackId });
};

module.exports = channelMessage;
