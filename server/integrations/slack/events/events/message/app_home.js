const { SlackUser, ProductUser, Sequelize } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const getTitleDescription = require('../../../../../lib/getTitleDescription');
const { decode } = require('../../../helpers/encoding');

const { Op } = Sequelize;

const postMenuChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const appHomeMessage = async (payload, { workspace }) => {
  const {
    event: { user: userSlackId, text: rawText, channel },
  } = payload;
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
      role: { [Op.in]: ['user', 'admin'] },
    },
  });

  await postMenuMessage({
    defaultFeedback: text,
    defaultRoadmapItemTitle: title,
    defaultRoadmapItemDescription: description,
    defaultAuthorId: slackUser.userId,
    productId: product.id,
    createRoadmapItem: !!productUser,
  })({ accessToken, channel, user: slackUser.slackId });
};

module.exports = appHomeMessage;
