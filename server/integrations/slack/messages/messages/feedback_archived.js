module.exports = ({ feedback }) => ({
  text: `*_The product team has archived your feedback_*`,
  attachments: [
    {
      color: '#f2d600',
      text: feedback.description,
      callback_id: 'feedback',
    },
    ...(feedback.archiveReason
      ? [
          {
            color: '#eb5a46',
            pretext: `*_Reason:_*`,
            text: feedback.archiveReason,
          },
        ]
      : []),
  ],
});
