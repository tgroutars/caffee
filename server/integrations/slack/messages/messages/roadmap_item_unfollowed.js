module.exports = ({ roadmapItem }) => ({
  text: `*_You unfollowed this item_*`,
  attachments: [
    {
      pretext: `I'll stop sending you updates about it`,
      callback_id: 'roadmap_item_unfollowed',
      actions: [
        {
          type: 'button',
          text: 'Follow again',
          value: 'follow_roadmap_item',
          name: {
            roadmapItemId: roadmapItem.id,
            type: 'follow_roadmap_item',
          },
        },
      ],
    },
  ],
});
