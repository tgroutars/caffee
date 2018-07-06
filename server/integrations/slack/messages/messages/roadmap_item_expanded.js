const getRoadmapItemAttachment = require('../attachments/roadmap_item');

module.exports = ({ roadmapItem, followers, stage }) => ({
  attachments: [
    getRoadmapItemAttachment({
      roadmapItem,
      followers,
      stage,
      showShowMore: false,
      showDescription: true,
    }),
  ],
});
