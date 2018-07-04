const Promise = require('bluebird');

const { BacklogItem, SlackInstall, Sequelize } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const postNewBacklogItemMessage = postMessage('new_backlog_item');

const backlogItemCreated = async ({ backlogItemId }) => {
  const backlogItem = await BacklogItem.findById(backlogItemId, {
    include: ['product'],
  });
  const { product } = backlogItem;

  const postPublicNewBacklogItemMessage = postNewBacklogItemMessage({
    backlogItem,
    product,
  });
  const slackInstalls = await SlackInstall.findAll({
    where: { productId: product.id, channel: { [Op.ne]: null } },
    include: ['workspace'],
  });

  await Promise.map(slackInstalls, async slackInstall => {
    const { workspace, channel } = slackInstall;
    const { accessToken } = workspace;
    await postPublicNewBacklogItemMessage({ accessToken, channel });
  });
};

module.exports = backlogItemCreated;
