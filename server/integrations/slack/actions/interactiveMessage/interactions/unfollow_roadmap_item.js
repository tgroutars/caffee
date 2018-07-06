const { RoadmapItem: RoadmapItemService } = require('../../../../../services');
const { RoadmapItem } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

module.exports = async (payload, { workspace, slackUser }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { roadmapItemId } = action.name;
  const roadmapItem = await RoadmapItem.findById(roadmapItemId);
  const { accessToken } = workspace;
  await RoadmapItemService.removeFollower(roadmapItemId, slackUser.userId);

  await postEphemeral('roadmap_item_unfollowed')({ roadmapItem })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};
