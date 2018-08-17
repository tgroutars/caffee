module.exports = ({ roadmapItem }) => ({
  attachments: [
    {
      actions: [
        {
          type: 'button',
          value: 'roadmap_item_show_more',
          name: {
            type: 'roadmap_item_show_more',
            roadmapItemId: roadmapItem.id,
          },
          text: 'View Item',
        },
      ],
      callback_id: 'roadmap_item_create_confirm',
      pretext: 'Done :thumbsup:',
    },
  ],
});
