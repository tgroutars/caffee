const Promise = require('bluebird');

const {
  SlackWorkspace,
  SlackUser,
  ProductUser,
  Sequelize,
} = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

const { Op } = Sequelize;

const openFeedbackDialog = openDialog('feedback');
const postChooseProductMessage = postEphemeral('feedback_choose_product');

const newFeedback = async payload => {
  const {
    team: { id: workspaceSlackId },
    user: { id: userSlackId },
    channel: { id: channel },
    message: { text, user: messageUserSlackId },
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

  const [messageSlackUser, slackUser] = await Promise.all([
    SlackUser.find({
      where: { slackId: messageUserSlackId },
    }),
    SlackUser.find({
      where: { slackId: userSlackId },
    }),
  ]);

  const defaultAuthorId = messageSlackUser
    ? messageSlackUser.userId
    : slackUser.userId;
  const defaultAuthorName =
    messageSlackUser && messageSlackUser.userId !== slackUser.userId
      ? messageSlackUser.name
      : null;

  if (products.length > 1) {
    await postChooseProductMessage({
      products,
      defaultAuthorId,
      defaultAuthorName,
      defaultFeedback: text,
    })({
      accessToken,
      channel,
      user: userSlackId,
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
    defaultAuthorId,
    defaultAuthorName,
    productId: product.id,
    defaultFeedback: text,
    selectAuthor: !!productUser,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = newFeedback;
