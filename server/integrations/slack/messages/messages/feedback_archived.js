module.exports = ({ feedback, archivedBy }) => ({
  text: `*_${
    archivedBy ? archivedBy.name : 'The product team'
  } has archived your feedback :no_entry_sign:_*`,
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
