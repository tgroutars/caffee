const getBacklogItemAttachment = require('../attachments/backlog_item');

module.exports = ({ backlogItem }) => ({
  text: '*_The product team suggested you to follow this item_*',
  attachments: [getBacklogItemAttachment({ backlogItem })],
});
