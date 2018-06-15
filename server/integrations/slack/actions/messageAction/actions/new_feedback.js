const { SlackWorkspace } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

const openFeedbackDialog = openDialog('feedback');
const postChooseProductMessage = postEphemeral('feedback_choose_product');

const newFeedback = async payload => {
  const {
    team: { id: workspaceSlackId },
    user: { id: userSlackId },
    channel: { id: channel },
    message: { text },
    trigger_id: triggerId,
  } = payload;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['products'],
  });
  const { accessToken, products } = workspace;

  if (!products.length) {
    return;
  }

  if (products.length > 1) {
    await postChooseProductMessage({ products, defaultFeedback: text })({
      accessToken,
      channel,
      user: userSlackId,
    });
    return;
  }
  const product = products[0];
  await openFeedbackDialog({ productId: product.id, defaultFeedback: text })({
    accessToken,
    triggerId,
  });
};

module.exports = newFeedback;
