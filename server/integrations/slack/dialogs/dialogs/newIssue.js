const newIssue = ({ productId, description = '' }) => {
  const callbackId = {
    type: 'new_issue',
    productId,
  };

  const elements = [
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
      value: description,
      max_length: 3000, // Maximum imposed by Slack
      optional: true,
    },
  ];

  return {
    callback_id: callbackId,
    title: 'Feedback',
    submit_label: 'Send',
    elements,
  };
};

module.exports = newIssue;
