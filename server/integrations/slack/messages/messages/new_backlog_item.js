const getBacklogItemAttachment = require('../attachments/backlog_item');

const newBacklogItem = ({
  backlogItem,
  product,
  openCard,
  suggestFollowers = false,
}) => {
  const attachments = [
    getBacklogItemAttachment({ backlogItem, openCard, suggestFollowers }),
  ];
  return {
    attachments,
    text: `*_New backlog item for ${product.name}_*`,
  };
};

module.exports = newBacklogItem;
