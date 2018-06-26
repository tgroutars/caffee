const getBacklogItemAttachment = require('../attachments/backlog_item');

module.exports = ({ backlogItem, followers, stage }) => ({
  attachments: [
    getBacklogItemAttachment({
      backlogItem,
      followers,
      stage,
      showShowMore: false,
      showDescription: true,
    }),
  ],
});
