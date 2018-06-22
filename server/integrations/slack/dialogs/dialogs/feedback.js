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
      name: 'select_author',
      type: 'select',
      data_source: 'external',
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
