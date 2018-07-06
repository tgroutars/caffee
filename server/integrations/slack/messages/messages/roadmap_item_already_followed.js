module.exports = ({ roadmapItem }) => ({
  text: `*_You already followed this item :blush:_*`,
  attachments: [
    {
      pretext: `I'll keep sending you updates on it`,
      callback_id: 'roadmap_item_followed',
      actions: [
        {
          type: 'button',
          text: 'Unfollow',
          value: 'unfollow_backlo_item',
          name: {
            roadmapItemId: roadmapItem.id,
            type: 'unfollow_roadmap_item',
          },
        },
      ],
    },
  ],
});
