const feedback = ({
  productId,
  defaultAuthorId,
  defaultAuthorName = null,
  selectAuthor = false,
  defaultFeedback = '',
}) => {
  const callbackId = {
    type: 'feedback',
    productId,
    defaultAuthorId,
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
    const hint = defaultAuthorName
      ? `If empty, the feedback will be attributed to ${defaultAuthorName}`
      : 'If empty, the feedback will be attributed to you';
    elements.unshift({
      hint,
      label: 'Author',
      name: 'authorId',
      type: 'select',
      data_source: 'external',
      optional: true,
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
