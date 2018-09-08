const { ProductUser } = require('../../../models');
const { postEphemeral } = require('../messages');
const getTitleDescription = require('../../../lib/getTitleDescription');
const { getPasswordLessURL } = require('../../../lib/auth');
const { productSettings } = require('../../../lib/clientRoutes');
const { SlackPermissionError } = require('../../../lib/errors');

const postChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const caffee = async ({ workspace, slackUser, user, text, channel }) => {
  const products = await user.getProducts();
  if (!products.length) {
    throw new SlackPermissionError();
  }

  const { accessToken } = workspace;
  const { title, description } = getTitleDescription(text);
  if (products.length > 1) {
    await postChooseProductMessage({
      products,
      defaulFeedback: text,
      defaultRoadmapItemTitle: title,
      defaultRoadmapItemDescription: description,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel, user: slackUser.slackId });
    return;
  }

  const [product] = products;
  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId: product.id,
    },
  });
  await postMenuMessage({
    productId: product.id,
    defaultFeedback: text,
    defaultRoadmapItemTitle: title,
    defaultRoadmapItemDescription: description,
    defaultAuthorId: slackUser.userId,
    createRoadmapItem: productUser.isPM,
    settingsURL: productUser.isAdmin
      ? await getPasswordLessURL(slackUser.userId, {
          path: productSettings(product.id),
        })
      : null,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};

module.exports = caffee;
