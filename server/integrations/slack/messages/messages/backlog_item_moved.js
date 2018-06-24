const backlogItemMoved = ({ backlogItem, oldStage, newStage }) => ({
  text: `*_A backlog item has moved_*`,
  attachments: [
    {
      text: backlogItem.title,
      callback_id: 'new_feedback',
      fields: [
        { title: 'From', value: oldStage.name, short: true },
        { title: 'To', value: newStage.name, short: true },
      ],
    },
  ],
});

module.exports = backlogItemMoved;
