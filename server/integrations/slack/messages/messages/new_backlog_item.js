const newBacklogItem = ({
  backlogItem,
  product,
  trelloURL,
  suggestFollowers = false,
}) => {
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
    text: `*_New backlog item for ${product.name}_*`,
    attachments: [
      {
        actions,
        title: backlogItem.title,
        text: backlogItem.description,
        callback_id: 'new_backlog_item',
      },
    ],
  };
};

module.exports = newBacklogItem;
