const feedback = ({
  productId,
  selectAuthor = false,
  defaultFeedback = '',
}) => {
  const callbackId = {
    type: 'feedback',
    productId,
  };

  const elements = [
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
      value: defaultFeedback,
      max_length: 3000, // Maximum imposed by Slack
      optional: false,
    },
  ];

  if (selectAuthor) {
    elements.unshift({
      label: 'Author',
      name: 'authorId',
      type: 'select',
      data_source: 'external',
      optional: true,
      hint: 'Leave empty to add the feedback as yourself',
    });
  }

  return {
    callback_id: callbackId,
    title: 'Feedback',
    submit_label: 'Send',
    elements,
  };
};

module.exports = feedback;
