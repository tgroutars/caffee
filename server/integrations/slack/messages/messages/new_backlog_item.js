const getBacklogItemAttachment = require('../attachments/backlog_item');

const newBacklogItem = ({
  backlogItem,
  product,
  trelloURL,
  suggestFollowers = false,
}) => {
  const attachments = [
    getBacklogItemAttachment({ backlogItem, trelloURL, suggestFollowers }),
  ];
  const actions = [];
  if (suggestFollowers) {
    actions.push({
      type: 'select',
      data_source: 'external',
      name: {
        type: 'backlog_item_suggest_follower',
        backlogItemId: backlogItem.id,
      },
      text: 'Suggest followers',
    });
  }
  if (trelloURL) {
    actions.push({
      type: 'button',
      text: 'Open Card in Trello',
      url: trelloURL,
    });
  }
  return {
    attachments,
    text: `*_New backlog item for ${product.name}_*`,
  };
};

module.exports = newBacklogItem;
