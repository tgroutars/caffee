const { postEphemeral } = require('../../../messages');
const { RoadmapItem } = require('../../../../../models');

module.exports = async (payload, { workspace, slackUser }) => {
  const {
    channel: { id: channel },
    action,
  } = payload;

  const { roadmapItemId } = action.name;
  const roadmapItem = await RoadmapItem.findById(roadmapItemId, {
    include: ['followers', 'stage'],
  });

  const { followers, stage } = roadmapItem;
  const { accessToken } = workspace;
  await postEphemeral('roadmap_item_expanded')({
    roadmapItem,
    followers,
    stage,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};
