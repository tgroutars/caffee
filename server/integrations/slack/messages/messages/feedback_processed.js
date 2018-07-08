const getRoadmapItemAttachment = require('../attachments/roadmap_item');

module.exports = ({ feedback, roadmapItem, processedBy, isPM, stage }) => ({
  text: `*_${
    processedBy ? processedBy.name : 'The product team'
  } has associated your feedback to a item in the roadmap :thumbsup:_*`,
  attachments: [
    {
      text: feedback.description,
      color: '#f2d600',
    },
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
