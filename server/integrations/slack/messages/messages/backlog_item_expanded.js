const getBacklogItemAttachment = require('../attachments/backlog_item');

module.exports = ({ backlogItem }) => ({
  text: 'coucou',
  attachments: [getBacklogItemAttachment({ backlogItem, showMore: true })],
});
