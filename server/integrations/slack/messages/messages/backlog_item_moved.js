const backlogItemMoved = ({
  backlogItem,
  oldStage,
  newStage,
  isFollowing = false,
}) => ({
  text: `*_${
    isFollowing ? `A backlog item you're following` : `A backlog item`
  } has moved_*`,
  attachments: [
    {
      title: backlogItem.title,
      text: backlogItem.description,
      callback_id: 'new_feedback',
      color: '#0079bf',
      fields: [
        { title: 'From', value: oldStage.name, short: true },
        { title: 'To', value: newStage.name, short: true },
      ],
    },
  ],
});

module.exports = backlogItemMoved;
