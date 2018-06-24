module.exports = ({ backlogItem }) => ({
  text: '*_The product team suggested you to follow this item_*',
  attachments: [
    {
      callback_id: 'backlog_item',
      title: backlogItem.title,
      text: backlogItem.description,
      color: '#0079bf',
      actions: [
        {
          type: 'button',
          value: 'follow_backlog_item',
          name: {
            type: 'follow_backlog_item',
            backlogItemId: backlogItem.id,
          },
          text: 'Follow',
        },
      ],
    },
  ],
});
