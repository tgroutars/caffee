const getRoadmapItemAttachment = require('../attachments/roadmap_item');

module.exports = ({ roadmapItem }) => ({
  text: '*_The product team suggested you to follow this item_*',
  attachments: [getRoadmapItemAttachment({ roadmapItem })],
});
