const { SlackUser, ProductUser, Sequelize } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

const { Op } = Sequelize;

const openFeedbackDialog = openDialog('feedback');
const postChooseProductMessage = postEphemeral('feedback_choose_product');

const newFeedback = async (payload, { workspace, slackUser }) => {
  const {
    channel: { id: channel },
    message: { text, user: messageUserSlackId, files },
    trigger_id: triggerId,
  } = payload;

  const products = await workspace.getProducts();
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
      role: { [Op.in]: ['user', 'admin'] },
    },
  });
  await openFeedbackDialog({
    files,
    defaultAuthorId,
    defaultAuthorName,
    product,
    defaultFeedback: text,
    selectAuthor: !!productUser,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = newFeedback;
