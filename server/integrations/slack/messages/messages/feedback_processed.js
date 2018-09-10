const getRoadmapItemAttachment = require('../attachments/roadmap_item');

module.exports = ({ roadmapItem, processedBy, isPM, stage }) => ({
  text: `*_${
    processedBy ? processedBy.name : 'The product team'
  } has associated this feedback to an item in the roadmap :thumbsup:_*`,
  attachments: [
    {
      ...getRoadmapItemAttachment({
        roadmapItem,
        isPM,
        stage,
        showMore: false,
        hideFollow: true,
      }),
      pretext: `*_Associated roadmap item:_*`,
    },
  ],
});
