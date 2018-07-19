const { getInstallURL } = require('../../../../trello/helpers/auth');
const { postEphemeral } = require('../../../messages');

module.exports = async (payload, { slackUser, workspace }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { productId } = action.name;

  const { appUserId, domain, accessToken } = workspace;
  const returnTo = `https://${domain}.slack.com/app_redirect?channel=${appUserId}`;
  const installURL = await getInstallURL(productId, {
    returnTo,
    userId: slackUser.userId,
    workspaceId: workspace.id,
  });

  await postEphemeral('install_trello')({ installURL })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};
