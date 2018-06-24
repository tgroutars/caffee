module.exports = ({ feedback, backlogItem }) => ({
  text: 'Your feedback has been associated to a backlog item',
  attachments: [
    {
      title: backlogItem.title,
      text: backlogItem.description,
      color: '#0079bf',
    },
    { pretext: 'Your feedback', text: feedback.description, color: '#f2d600' },
  ],
});
