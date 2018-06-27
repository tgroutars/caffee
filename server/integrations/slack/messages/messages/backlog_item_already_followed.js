module.exports = ({ backlogItem }) => ({
  text: `*_You already followed this item :blush:_*`,
  attachments: [
    {
      pretext: `I'll keep sending you updates on it`,
      callback_id: 'backlog_item_followed',
      actions: [
        {
          type: 'button',
          text: 'Unfollow',
          value: 'unfollow_backlo_item',
          name: {
            backlogItemId: backlogItem.id,
            type: 'unfollow_backlog_item',
          },
        },
      ],
    },
  ],
});
