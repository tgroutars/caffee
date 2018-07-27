const Promise = require('bluebird');

const { RoadmapItem, SlackInstall, Sequelize } = require('../../models');
const { RoadmapItem: RoadmapItemService } = require('../../services');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const postNewRoadmapItemMessage = postMessage('new_roadmap_item');

const roadmapItemCreated = async ({ roadmapItemId }) => {
  const roadmapItem = await RoadmapItem.unscoped().findById(roadmapItemId, {
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

  const publicMessages = await Promise.map(
    slackInstalls,
    async slackInstall => {
      const { workspace, channel } = slackInstall;
      const { accessToken } = workspace;
      const message = await postPublicNewRoadmapItemMessage({
        accessToken,
        channel,
      });
      return {
        channel: message.channel,
        ts: message.ts,
        workspaceId: workspace.id,
      };
    },
  );

  await RoadmapItemService.setPublicMessages(roadmapItemId, publicMessages);
};

module.exports = roadmapItemCreated;
