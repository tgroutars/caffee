const Promise = require('bluebird');

const { RoadmapStage } = require('../../models');
const { Activity: ActivityService } = require('../../services');

module.exports = async ({ roadmapItemId, oldStageId, newStageId }) => {
  const [oldStage, newStage] = await Promise.all([
    RoadmapStage.findById(oldStageId),
    RoadmapStage.findById(newStageId),
  ]);
  await ActivityService.createMoved(roadmapItemId, {
    oldStage,
    newStage,
  });
};

// TODO: send updates
// const [roadmapItem, oldStage, newStage] = await Promise.all([
//   RoadmapItem.findById(roadmapItemId),
//   RoadmapStage.findById(oldStageId),
//   RoadmapStage.findById(newStageId),
// ]);
// const slackInstalls = await SlackInstall.findAll({
//   where: { productId: roadmapItem.productId, channel: { [Op.ne]: null } },
//   include: ['workspace'],
// });
//
// await Promise.map(slackInstalls, async slackInstall => {
//   const { workspace, channel } = slackInstall;
//   const { accessToken } = workspace;
//   await postItemMovedMessage({
//     roadmapItem,
//     oldStage,
//     newStage,
//   })({ accessToken, channel });
// });
//
// const followers = await roadmapItem.getFollowers({
//   include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
// });
//
// await Promise.map(followers, async follower =>
//   Promise.map(follower.slackUsers, async slackUser => {
//     const { workspace, slackId: userSlackId } = slackUser;
//     const { accessToken } = workspace;
//     await postItemMovedMessage({
//       roadmapItem,
//       oldStage,
//       newStage,
//       isFollowing: true,
//     })({ accessToken, channel: userSlackId });
//   }),
// );
