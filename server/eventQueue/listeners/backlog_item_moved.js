const Promise = require('bluebird');

const {
  BacklogItem,
  BacklogStage,
  SlackInstall,
  Sequelize,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

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
  const postItemMovedMessage = postMessage('backlog_item_moved')({
    backlogItem,
    oldStage,
    newStage,
  });

  await Promise.map(slackInstalls, async slackInstall => {
    const { workspace, channel } = slackInstall;
    const { accessToken } = workspace;
    await postItemMovedMessage({ accessToken, channel });
  });
};

module.exports = backlogItemMoved;
