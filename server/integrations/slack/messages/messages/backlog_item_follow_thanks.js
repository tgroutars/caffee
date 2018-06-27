module.exports = ({ backlogItem }) => ({
  text: `*_You're now following this item :raised_hands:_*`,
  attachments: [
    {
      pretext: `I'll send you updates about it`,
      callback_id: 'backlog_item_followed',
      actions: [
        {
          type: 'button',
          text: 'Unfollow',
          value: 'unfollow_backlog_item',
          name: {
            backlogItemId: backlogItem.id,
            type: 'unfollow_backlog_item',
          },
        },
      ],
    },
  ],
});
