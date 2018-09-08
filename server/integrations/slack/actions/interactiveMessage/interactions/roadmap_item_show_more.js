const { postEphemeral } = require('../../../messages');
const { RoadmapItem, ProductUser } = require('../../../../../models');
const { SlackPermissionError } = require('../../../../../lib/errors');

module.exports = async (payload, { workspace, slackUser, user }) => {
  const {
    channel: { id: channel },
    action,
  } = payload;

  const { roadmapItemId } = action.name;
  const roadmapItem = await RoadmapItem.findById(roadmapItemId, {
    include: ['followers', 'stage'],
  });
  const productUser = await ProductUser.find({
    where: { productId: roadmapItem.productId, userId: user.id },
  });
  if (!productUser) {
    throw new SlackPermissionError();
  }

  const { isPM } = productUser;
  const { followers, stage } = roadmapItem;
  const { accessToken } = workspace;
  await postEphemeral('roadmap_item_expanded')({
    roadmapItem,
    followers,
    stage,
    isPM,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};
