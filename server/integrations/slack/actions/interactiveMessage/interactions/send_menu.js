const { postEphemeral } = require('../../../messages');

const postMenuMessage = postEphemeral('menu');

const sendMenu = async (payload, { workspace, slackUser }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;

  const {
    productId,
    defaultText,
    defaultAuthorId,
    defaultAuthorName,
  } = action.name;

  const { accessToken } = workspace;

  await postMenuMessage({
    productId,
    defaultText,
    defaultAuthorId,
    defaultAuthorName,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};

module.exports = sendMenu;
