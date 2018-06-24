module.exports = ({ feedback, backlogItem }) => ({
  text: '*_Your feedback has been associated to a backlog item_*',
  attachments: [
    {
      title: backlogItem.title,
      text: backlogItem.description,
      color: '#0079bf',
    },
    {
      pretext: '*_Your feedback_*',
      text: feedback.description,
      color: '#f2d600',
    },
  ],
});
