module.exports = ({ backlogItem }) => ({
  text: `*_You unfollowed this item_*`,
  attachments: [
    {
      pretext: `I'll stop sending you updates about it`,
      callback_id: 'backlog_item_unfollowed',
      actions: [
        {
          type: 'button',
          text: 'Follow again',
          value: 'follow_backlog_item',
          name: {
            backlogItemId: backlogItem.id,
            type: 'follow_backlog_item',
          },
        },
      ],
    },
  ],
});
