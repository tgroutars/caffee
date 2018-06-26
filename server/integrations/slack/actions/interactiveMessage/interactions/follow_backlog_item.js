const { BacklogItem: BacklogItemService } = require('../../../../../services');
const { postEphemeral } = require('../../../messages');

module.exports = async (payload, { workspace, slackUser }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { backlogItemId } = action.name;

  const { accessToken } = workspace;
  const [, created] = await BacklogItemService.addFollower(
    backlogItemId,
    slackUser.userId,
  );
  if (created) {
    await postEphemeral('backlog_item_follow_thanks')()({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  } else {
    await postEphemeral('backlog_item_already_followed')()({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  }
};
