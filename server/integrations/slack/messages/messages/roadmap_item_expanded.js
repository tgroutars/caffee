const getRoadmapItemAttachment = require('../attachments/roadmap_item');

module.exports = ({ roadmapItem, followers, stage, isPM }) => ({
  attachments: [
    getRoadmapItemAttachment({
      roadmapItem,
      followers,
      stage,
      isPM,
      showMore: true,
    }),
  ],
});
