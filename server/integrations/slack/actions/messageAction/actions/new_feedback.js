const Promise = require('bluebird');
const SlackClient = require('@slack/client').WebClient;

const { SlackUser, ProductUser, Sequelize } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

const { Op } = Sequelize;

const openFeedbackDialog = openDialog('feedback');
const postChooseProductMessage = postEphemeral('feedback_choose_product');

const newFeedback = async (payload, { workspace, slackUser, user }) => {
  const {
    channel: { id: channel },
    message: { text, user: messageUserSlackId, files, replies, ts },
    trigger_id: triggerId,
  } = payload;

  const products = await user.getProducts({
    through: { where: { role: { [Op.in]: ['user', 'admin'] } } },
  });

  if (!products.length) {
    return;
  }

  const { accessToken } = workspace;
  const messageSlackUser = await SlackUser.find({
    where: { slackId: messageUserSlackId },
  });

  let defaultFeedback = text;
  if (replies && replies.length) {
    const slackClient = new SlackClient(accessToken);
    const { messages } = await slackClient.conversations.replies({
      channel,
      ts,
    });
    const thread = (await Promise.map(messages, async message => {
      const commentSlackUser = await SlackUser.find({
        where: { workspaceId: workspace.id, slackId: message.user },
      });
      return `${commentSlackUser.name}: ${message.text}`;
    })).join('\n');
    defaultFeedback = `${defaultFeedback}\n\nOriginal thread:\n${thread}`;
  }

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
      defaultFeedback,
    })({
      accessToken,
      channel,
      user: slackUser.slackId,
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
    defaultFeedback,
    selectAuthor: productUser.isPM,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = newFeedback;
