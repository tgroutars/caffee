const newBacklogItem = ({ backlogItem, product, trelloURL }) => {
  const actions = [];
  if (trelloURL) {
    actions.push({
      type: 'button',
      text: 'Open Card in Trello',
      url: trelloURL,
    });
  }
  return {
    text: `New backlog item for ${product.name}`,
    attachments: [
      {
        actions,
        title: backlogItem.title,
        text: backlogItem.description,
        callback_id: 'new_feedback',
      },
    ],
  };
};

module.exports = newBacklogItem;
