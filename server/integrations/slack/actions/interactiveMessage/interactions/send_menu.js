const { SlackWorkspace } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

const postMenuMessage = postEphemeral('menu');

const sendMenu = async payload => {
  const {
    team: { id: workspaceSlackId },
    action,
    channel: { id: channel },
    user: { id: userSlackId },
  } = payload;

  const { productId } = action.value;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const { accessToken } = workspace;

  await postMenuMessage({ productId })({
    accessToken,
    channel,
    user: userSlackId,
  });
};

module.exports = sendMenu;
