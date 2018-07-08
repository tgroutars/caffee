const Promise = require('bluebird');

const { RoadmapItem, SlackInstall, Sequelize } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const postNewRoadmapItemMessage = postMessage('new_roadmap_item');

const roadmapItemCreated = async ({ roadmapItemId }) => {
  const roadmapItem = await RoadmapItem.findById(roadmapItemId, {
    include: ['product', 'stage'],
  });
  const { product, stage } = roadmapItem;

  const postPublicNewRoadmapItemMessage = postNewRoadmapItemMessage({
    roadmapItem,
    product,
    stage,
  });
  const slackInstalls = await SlackInstall.findAll({
    where: { productId: product.id, channel: { [Op.ne]: null } },
    include: ['workspace'],
  });

  await Promise.map(slackInstalls, async slackInstall => {
    const { workspace, channel } = slackInstall;
    const { accessToken } = workspace;
    await postPublicNewRoadmapItemMessage({ accessToken, channel });
  });
};

module.exports = roadmapItemCreated;
