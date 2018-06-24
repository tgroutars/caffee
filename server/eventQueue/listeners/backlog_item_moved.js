const Promise = require('bluebird');

const {
  BacklogItem,
  BacklogStage,
  SlackInstall,
  SlackUser,
  Sequelize,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const postItemMovedMessage = postMessage('backlog_item_moved');

const backlogItemMoved = async ({ backlogItemId, oldStageId, newStageId }) => {
  const [backlogItem, oldStage, newStage] = await Promise.all([
    BacklogItem.findById(backlogItemId),
    BacklogStage.findById(oldStageId),
    BacklogStage.findById(newStageId),
  ]);
  const slackInstalls = await SlackInstall.findAll({
    where: { productId: backlogItem.productId, channel: { [Op.ne]: null } },
    include: ['workspace'],
  });

  await Promise.map(slackInstalls, async slackInstall => {
    const { workspace, channel } = slackInstall;
    const { accessToken } = workspace;
    await postItemMovedMessage({
      backlogItem,
      oldStage,
      newStage,
    })({ accessToken, channel });
  });

  const followers = await backlogItem.getFollowers({
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });

  await Promise.map(followers, async follower =>
    Promise.map(follower.slackUsers, async slackUser => {
      const { workspace, slackId: userSlackId } = slackUser;
      const { accessToken } = workspace;
      await postItemMovedMessage({
        backlogItem,
        oldStage,
        newStage,
        isFollowing: true,
      })({ accessToken, channel: userSlackId });
    }),
  );
};

module.exports = backlogItemMoved;
