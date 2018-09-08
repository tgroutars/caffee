const { SlackUser, ProductUser } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

const openFeedbackDialog = openDialog('feedback');
const postChooseProductMessage = postEphemeral('feedback_choose_product');

const newFeedback = async (payload, { workspace, slackUser, user }) => {
  const {
    channel: { id: channel },
    message: { text, user: messageUserSlackId, files },
    trigger_id: triggerId,
  } = payload;

  const products = await user.getProducts();

  if (!products.length) {
    return;
  }

  const { accessToken } = workspace;
  const messageSlackUser = await SlackUser.find({
    where: { slackId: messageUserSlackId },
  });

  const defaultAuthorId = messageSlackUser
    ? messageSlackUser.userId
    : slackUser.userId;
  const defaultAuthorName =
    messageSlackUser && messageSlackUser.userId !== slackUser.userId
      ? messageSlackUser.name
      : null;

  if (products.length > 1) {
    await postChooseProductMessage({
      files,
      products,
      defaultAuthorId,
      defaultAuthorName,
      defaultFeedback: text,
    })({
      accessToken,
      channel,
      user: slackUser.id,
    });
    return;
  }
  const product = products[0];
  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId: product.id,
    },
  });
  await openFeedbackDialog({
    files,
    defaultAuthorId,
    defaultAuthorName,
    product,
    defaultFeedback: text,
    selectAuthor: productUser.isPM,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = newFeedback;
