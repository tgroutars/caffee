module.exports = ({ feedbackId }) => {
  const callbackId = {
    type: 'archive_feedback',
    feedbackId,
  };

  const elements = [
    {
      label: 'Reason',
      name: 'archiveReason',
      hint: 'Give a reason for archiving this feedback',
      type: 'textarea',
      max_length: 3000, // Maximum imposed by Slack
      optional: true,
    },
  ];

  return {
    callback_id: callbackId,
    title: 'Archive feedback',
    submit_label: 'Archive',
    elements,
  };
};
