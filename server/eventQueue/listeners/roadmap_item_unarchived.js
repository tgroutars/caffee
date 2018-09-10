const { Activity: ActivityService } = require('../../services');

module.exports = async ({ roadmapItemId }) => {
  await ActivityService.createUnarchived(roadmapItemId);
};

// TODO: Send updates
// const roadmapItem = await RoadmapItem.findById(roadmapItemId, {
//   include: ['product', 'stage'],
// });
// const { product, stage } = roadmapItem;
//
// const postPublicNewRoadmapItemMessage = postNewRoadmapItemMessage({
//   roadmapItem,
//   product,
//   stage,
// });
// const slackInstalls = await SlackInstall.findAll({
//   where: { productId: product.id, channel: { [Op.ne]: null } },
//   include: ['workspace'],
// });
//
// const publicMessages = await Promise.map(
//   slackInstalls,
//   async slackInstall => {
//     const { workspace, channel } = slackInstall;
//     const { accessToken } = workspace;
//     const message = await postPublicNewRoadmapItemMessage({
//       accessToken,
//       channel,
//     });
//     return {
//       channel: message.channel,
//       ts: message.ts,
//       workspaceId: workspace.id,
//     };
//   },
// );
//
// await RoadmapItemService.setPublicMessages(roadmapItemId, publicMessages);
