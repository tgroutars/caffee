const { SlackUser, ProductUser, Sequelize } = require('../../../../../models');
const { postMessage } = require('../../../messages');
const getTitleDescription = require('../../../../../lib/getTitleDescription');

const { Op } = Sequelize;

const postMenuChooseProductMessage = postMessage('menu_choose_product');
const postMenuMessage = postMessage('menu');

const appHomeMessage = async (payload, { workspace }) => {
  const {
    event: { user: userSlackId, text, channel },
  } = payload;
  const products = await workspace.getProducts();
  const { accessToken, appUserId } = workspace;

  if (userSlackId === appUserId) {
    return;
  }

  if (!products.length) {
    return;
  }

  const { title, description } = getTitleDescription(text);

  const slackUser = await SlackUser.find({ where: { slackId: userSlackId } });

  if (products.length > 1) {
    await postMenuChooseProductMessage({
      products,
      defaultFeedback: text,
      defaultRoadmapItemTitle: title,
      defaultRoadmapItemDescription: description,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel });
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
  })({ accessToken, channel });
};

module.exports = appHomeMessage;
