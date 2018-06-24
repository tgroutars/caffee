const { SlackWorkspace, SlackUser } = require('../../../../../models');
const { BacklogItem: BacklogItemService } = require('../../../../../services');
const { postEphemeral } = require('../../../messages');

module.exports = async payload => {
  const {
    action,
    user: { id: userSlackId },
    team: { id: workspaceSlackId },
    channel: { id: channel },
  } = payload;
  const { backlogItemId } = action.name;
  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId },
    include: [
      {
        model: SlackWorkspace,
        as: 'workspace',
        where: { slackId: workspaceSlackId },
      },
    ],
  });
  const { workspace, userId } = slackUser;
  const { accessToken } = workspace;
  const [, created] = await BacklogItemService.addFollower(
    backlogItemId,
    userId,
  );
  if (created) {
    await postEphemeral('backlog_item_follow_thanks')()({
      accessToken,
      channel,
      user: userSlackId,
    });
  } else {
    await postEphemeral('backlog_item_already_followed')()({
      accessToken,
      channel,
      user: userSlackId,
    });
  }
};
