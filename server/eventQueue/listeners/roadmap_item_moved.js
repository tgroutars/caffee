const Promise = require('bluebird');

const {
  RoadmapItem,
  RoadmapStage,
  SlackInstall,
  SlackUser,
  Sequelize,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const postItemMovedMessage = postMessage('roadmap_item_moved');

const roadmapItemMoved = async ({ roadmapItemId, oldStageId, newStageId }) => {
  const [roadmapItem, oldStage, newStage] = await Promise.all([
    RoadmapItem.findById(roadmapItemId),
    RoadmapStage.findById(oldStageId),
    RoadmapStage.findById(newStageId),
  ]);
  const slackInstalls = await SlackInstall.findAll({
    where: { productId: roadmapItem.productId, channel: { [Op.ne]: null } },
    include: ['workspace'],
  });

  await Promise.map(slackInstalls, async slackInstall => {
    const { workspace, channel } = slackInstall;
    const { accessToken } = workspace;
    await postItemMovedMessage({
      roadmapItem,
      oldStage,
      newStage,
    })({ accessToken, channel });
  });

  const followers = await roadmapItem.getFollowers({
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });

  await Promise.map(followers, async follower =>
    Promise.map(follower.slackUsers, async slackUser => {
      const { workspace, slackId: userSlackId } = slackUser;
      const { accessToken } = workspace;
      await postItemMovedMessage({
        roadmapItem,
        oldStage,
        newStage,
        isFollowing: true,
      })({ accessToken, channel: userSlackId });
    }),
  );
};

module.exports = roadmapItemMoved;
