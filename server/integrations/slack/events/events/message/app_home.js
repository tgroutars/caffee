const { SlackUser, ProductUser } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const getTitleDescription = require('../../../../../lib/getTitleDescription');
const { decode } = require('../../../helpers/encoding');
const { getPasswordLessURL } = require('../../../../../lib/auth');
const { productSettings } = require('../../../../../lib/clientRoutes');

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const appHomeMessage = async (payload, { workspace }) => {
  const { event } = payload;
  const {
    user: userSlackId,
    channel,
    files = [],
    channel_type: channelType,
    subtype,
    thread_ts: threadTS,
  } = event;
  const { accessToken, appUserId } = workspace;
  const rawText = event.text || '';

  if (
    // Not a DM to Caffee
    channelType !== 'app_home' ||
    // A message was updated
    subtype === 'message_changed' ||
    // Message in thread
    threadTS ||
    // Message from Caffee itself
    userSlackId === appUserId
  ) {
    return;
  }

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId, workspaceId: workspace.id },
    include: ['user'],
  });
  const { user } = slackUser;
  const products = await user.getProducts();

  if (!products.length) {
    return;
  }

  const text = await decode(workspace)(rawText);

  const { title, description } = getTitleDescription(text);

  if (products.length > 1) {
    await postMenuChooseProductMessage({
      products,
      files,
      defaultFeedback: text,
      defaultRoadmapItemTitle: title,
      defaultRoadmapItemDescription: description,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel, user: slackUser.slackId });
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
    defaultFeedback: text,
    defaultRoadmapItemTitle: title,
    defaultRoadmapItemDescription: description,
    defaultAuthorId: slackUser.userId,
    productId: product.id,
    createRoadmapItem: productUser.isPM,
    settingsURL: productUser.isAdmin
      ? await getPasswordLessURL(slackUser.userId, {
          path: productSettings(product.id),
        })
      : null,
  })({ accessToken, channel, user: slackUser.slackId });
};

module.exports = appHomeMessage;
