const newBacklogItem = ({ backlogItem, product, trelloURL }) => ({
  text: `New backlog item for ${product.name}`,
  attachments: [
    {
      title: backlogItem.title,
      text: backlogItem.description,
      callback_id: 'new_feedback',
      actions: [
        {
          type: 'button',
          text: 'Open Card in Trello',
          url: trelloURL,
        },
      ],
    },
  ],
});

module.exports = newBacklogItem;
