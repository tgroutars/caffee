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
  const [, created] = await RoadmapItemService.addFollower(
    roadmapItemId,
    slackUser.userId,
  );
  if (created) {
    await postEphemeral('roadmap_item_follow_thanks')({ roadmapItem })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  } else {
    await postEphemeral('roadmap_item_already_followed')({ roadmapItem })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  }
};
