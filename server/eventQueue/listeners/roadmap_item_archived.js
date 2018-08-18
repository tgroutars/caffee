const Promise = require('bluebird');

const {
  RoadmapItem,
  SlackInstall,
  SlackUser,
  Sequelize,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const postRoadmapItemArchivedMessage = postMessage('roadmap_item_archived');

module.exports = async ({ roadmapItemId }) => {
  const roadmapItem = await RoadmapItem.findById(roadmapItemId);

  const slackInstalls = await SlackInstall.findAll({
    where: { productId: roadmapItem.productId, channel: { [Op.ne]: null } },
    include: ['workspace'],
  });

  await Promise.map(slackInstalls, async slackInstall => {
    const { workspace, channel } = slackInstall;
    const { accessToken } = workspace;
    await postRoadmapItemArchivedMessage({
      roadmapItem,
    })({ accessToken, channel });
  });

  const followers = await roadmapItem.getFollowers({
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });

  await Promise.map(followers, async follower =>
    Promise.map(follower.slackUsers, async slackUser => {
      const { workspace, slackId: userSlackId } = slackUser;
      const { accessToken } = workspace;
      await postRoadmapItemArchivedMessage({
        roadmapItem,
        isFollowing: true,
      })({ accessToken, channel: userSlackId });
    }),
  );
};
