const { SlackWorkspace } = require('../../../../../models');
const { postMessage } = require('../../../messages');

const postMenuChooseProductMessage = postMessage('menu_choose_product');
const postMenuMessage = postMessage('menu');

const appHomeMessage = async payload => {
  const {
    team_id: workspaceSlackId,
    event: { user, text, channel },
  } = payload;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['products'],
  });
  const { accessToken, products, appUserId } = workspace;
  if (user === appUserId) {
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
  await postMenuMessage({
    defaultFeedback: text,
    productId: products[0].id,
  })({ accessToken, channel });
};

module.exports = appHomeMessage;
