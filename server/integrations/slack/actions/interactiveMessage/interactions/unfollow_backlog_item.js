const { BacklogItem: BacklogItemService } = require('../../../../../services');
const { BacklogItem } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

module.exports = async (payload, { workspace, slackUser }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { backlogItemId } = action.name;
  const backlogItem = await BacklogItem.findById(backlogItemId);
  const { accessToken } = workspace;
  await BacklogItemService.removeFollower(backlogItemId, slackUser.userId);

  await postEphemeral('backlog_item_unfollowed')({ backlogItem })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};
