const feedbackChooseProduct = ({
  products,
  defaultAuthorId,
  defaultFeedback = '',
  defaultAuthorName = null,
}) => {
  const pretext = 'Which product does your feedback concern?';
  const actions = products.map(product => ({
    type: 'button',
    text: product.name,
    value: 'open_feedback_dialog',
    name: {
      defaultFeedback,
      defaultAuthorId,
      defaultAuthorName,
      type: 'open_feedback_dialog',
      productId: product.id,
    },
  }));
  return {
    attachments: [
      {
        actions,
        pretext,
        callback_id: 'feedback_choose_product',
      },
    ],
  };
};

module.exports = feedbackChooseProduct;
