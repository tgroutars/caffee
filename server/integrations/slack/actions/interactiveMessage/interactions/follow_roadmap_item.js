const { RoadmapItem: RoadmapItemService } = require('../../../../../services');
const { RoadmapItem, ProductUser } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { SlackPermissionError } = require('../../../../../lib/errors');

// TODO: request an invite to the admin if not allowed to follow
module.exports = async (payload, { workspace, slackUser, user }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { roadmapItemId } = action.name;
  const roadmapItem = await RoadmapItem.findById(roadmapItemId);

  const productUser = await ProductUser.find({
    where: { productId: roadmapItem.productId, userId: user.id },
  });
  if (!productUser) {
    throw new SlackPermissionError();
  }

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
