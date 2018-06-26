const { SlackUser } = require('../../../../../models');
const { postMessage } = require('../../../messages');

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

  const slackUser = await SlackUser.find({ where: { slackId: userSlackId } });

  if (products.length > 1) {
    await postMenuChooseProductMessage({
      products,
      defaultText: text,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel });
    return;
  }
  await postMenuMessage({
    defaultText: text,
    defaultAuthorId: slackUser.userId,
    productId: products[0].id,
  })({ accessToken, channel });
};

module.exports = appHomeMessage;
