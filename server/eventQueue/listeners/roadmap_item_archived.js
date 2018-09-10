const { Activity: ActivityService } = require('../../services');

module.exports = async ({ roadmapItemId }) => {
  await ActivityService.createArchived(roadmapItemId);
};

// TODO: Send updates when confirming
// const slackInstalls = await SlackInstall.findAll({
//   where: { productId: roadmapItem.productId, channel: { [Op.ne]: null } },
//   include: ['workspace'],
// });
//
// await Promise.map(slackInstalls, async slackInstall => {
//   const { workspace, channel } = slackInstall;
//   const { accessToken } = workspace;
//   await postRoadmapItemArchivedMessage({
//     roadmapItem,
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
//     await postRoadmapItemArchivedMessage({
//       roadmapItem,
//       isFollowing: true,
//     })({ accessToken, channel: userSlackId });
//   }),
// );
