const SlackClient = require('@slack/client').WebClient;

const { isUser, getUserVals } = require('../../helpers/user');
const { SlackUser: SlackUserService } = require('../../../../services');

const teamJoin = async (payload, { workspace }) => {
  const { id: userSlackId, team_id: userWorkspaceSlackId } = payload.event.user;
  // We get events from users in shared channels,
  // which are not part of the workspace
  if (userWorkspaceSlackId !== workspace.slackId) {
    return;
  }
  const slackClient = new SlackClient(workspace.accessToken);
  const { user: userInfo } = await slackClient.users.info({
    user: userSlackId,
  });
  if (!isUser(userInfo)) {
    await SlackUserService.destroy({
      where: { slackId: userSlackId, workspaceId: workspace.id },
    });
    return;
  }
  const { email, name, slackId, image } = getUserVals(userInfo);
  await SlackUserService.findOrCreate({
    email,
    name,
    slackId,
    image,
    workspaceId: workspace.id,
  });
};

module.exports = teamJoin;
