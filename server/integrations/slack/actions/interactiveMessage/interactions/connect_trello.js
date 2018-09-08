const { getInstallURL } = require('../../../../trello/helpers/auth');
const { postEphemeral } = require('../../../messages');
const { ProductUser } = require('../../../../../models');
const { SlackPermissionError } = require('../../../../../lib/errors');

module.exports = async (payload, { slackUser, workspace, user }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { productId } = action.name;

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser || !productUser.isAdmin) {
    throw new SlackPermissionError();
  }

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
