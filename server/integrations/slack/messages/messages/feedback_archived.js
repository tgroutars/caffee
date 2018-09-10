module.exports = ({ feedback, archivedBy }) => ({
  text: `*_${
    archivedBy ? archivedBy.name : 'The product team'
  } has archived this feedback :man-gesturing-no:_*`,
  attachments: feedback.archiveReason
    ? [
        {
          color: '#eb5a46',
          pretext: `*_Reason:_*`,
          text: feedback.archiveReason,
        },
      ]
    : [],
});
