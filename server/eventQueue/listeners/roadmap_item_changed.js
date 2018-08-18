const Promise = require('bluebird');

const { RoadmapItem, SlackWorkspace } = require('../../models');
const { updateMessage } = require('../../integrations/slack/messages');

module.exports = async ({ roadmapItemId }) => {
  const roadmapItem = await RoadmapItem.findById(roadmapItemId, {
    include: ['product', 'stage'],
  });
  const { product, stage } = roadmapItem;

  await Promise.map(
    roadmapItem.publicMessages,
    async ({ workspaceId, channel, ts }) => {
      const workspace = await SlackWorkspace.findById(workspaceId);
      const { accessToken } = workspace;
      await updateMessage('new_roadmap_item')({ roadmapItem, product, stage })({
        accessToken,
        channel,
        ts,
      });
    },
  );
};
