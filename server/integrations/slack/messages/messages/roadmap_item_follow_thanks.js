module.exports = ({ roadmapItem }) => ({
  text: `*_You're now following this item :raised_hands:_*`,
  attachments: [
    {
      pretext: `I'll send you updates about it`,
      callback_id: 'roadmap_item_followed',
      actions: [
        {
          type: 'button',
          text: 'Unfollow',
          value: 'unfollow_roadmap_item',
          name: {
            roadmapItemId: roadmapItem.id,
            type: 'unfollow_roadmap_item',
          },
        },
      ],
    },
  ],
});
