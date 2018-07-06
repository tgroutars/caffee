const getBacklogItemAttachment = require('../attachments/backlog_item');

module.exports = ({ feedback, backlogItem, processedBy }) => ({
  text: `*_${
    processedBy ? processedBy.name : 'The product team'
  } has associated your feedback to a item in the roadmap :thumbsup:_*`,
  attachments: [
    {
      text: feedback.description,
      color: '#f2d600',
    },
    {
      ...getBacklogItemAttachment({
        backlogItem,
        showShowMore: true,
        follow: false,
      }),
      pretext: `*_Associated backlog item:_*`,
    },
  ],
});
