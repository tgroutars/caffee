const SlackClient = require('@slack/client').WebClient;
const Promise = require('bluebird');

const { isUser, getUserVals } = require('../../helpers/user');
const { SlackInstall } = require('../../../../models');
const { SlackUser: SlackUserService } = require('../../../../services');

const teamJoin = async (payload, { workspace }) => {
  const { id: userSlackId } = payload.event.user;
  const slackClient = new SlackClient(workspace.accessToken);
  const { user: userInfo } = await slackClient.users.info({
    user: userSlackId,
  });
  if (!isUser(userInfo)) {
    return;
  }
  const { email, name, slackId, image } = getUserVals(userInfo);
  const [slackUser] = await SlackUserService.findOrCreate({
    email,
    name,
    slackId,
    image,
    workspaceId: workspace.id,
  });
  const slackInstalls = await SlackInstall.findAll({
    where: { workspaceId: workspace.id },
  });
  await Promise.map(slackInstalls, async ({ productId }) => {
    await slackUser.user.addProduct(productId);
  });
};

module.exports = teamJoin;
