const { SlackUser, ProductUser } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const getTitleDescription = require('../../../../../lib/getTitleDescription');
const { decode } = require('../../../helpers/encoding');
const { passwordlessURL } = require('../../../../../lib/auth');

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const appHomeMessage = async (payload, { workspace }) => {
  const { event } = payload;
  const { user: userSlackId, channel, files = [] } = event;
  const rawText = event.text || '';

  const products = await workspace.getProducts();
  const { accessToken, appUserId } = workspace;

  if (userSlackId === appUserId) {
    return;
  }

  if (!products.length) {
    return;
  }

  const text = await decode(workspace)(rawText);

  const { title, description } = getTitleDescription(text);

  const slackUser = await SlackUser.find({ where: { slackId: userSlackId } });

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
      ? await passwordlessURL(slackUser.userId, { productId: product.id })
      : null,
  })({ accessToken, channel, user: slackUser.slackId });
};

module.exports = appHomeMessage;
