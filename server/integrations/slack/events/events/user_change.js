const SlackClient = require('@slack/client').WebClient;

const { isUser, getUserVals } = require('../../helpers/user');
const { SlackUser: SlackUserService } = require('../../../../services');
const { SlackWorkspace } = require('../../../../models');

const teamJoin = async payload => {
  const { id: userSlackId, team_id: workspaceSlackId } = payload.event.user;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  if (!workspace) {
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
