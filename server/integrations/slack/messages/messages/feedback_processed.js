const getBacklogItemAttachment = require('../attachments/backlog_item');

module.exports = ({ feedback, backlogItem }) => ({
  text: '*_Your feedback has been associated to a item in the roadmap_*',
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
