module.exports = ({ createdBy, feedback }) => ({
  text: `*${
    createdBy.name
  }* *_logged a feedback on your behalf_*\nYou'll get notified when the product team acts on it`,
  attachments: [
    {
      text: feedback.description,
      color: '#f2d600',
    },
  ],
});
