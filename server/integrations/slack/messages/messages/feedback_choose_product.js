const feedbackChooseProduct = ({ products, defaultFeedback = '' }) => {
  const pretext = 'Which product does your feedback concern?';
  const actions = products.map(product => ({
    type: 'button',
    text: product.name,
    value: 'open_feedback_dialog',
    name: {
      type: 'open_feedback_dialog',
      defaultFeedback,
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
