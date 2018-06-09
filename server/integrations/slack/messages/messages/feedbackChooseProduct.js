const feedbackChooseProduct = ({ products }) => {
  const pretext = 'Which product does your feedback concern?';
  const actions = products.map(product => ({
    type: 'button',
    text: product.name,
    name: 'open_issue_dialog',
    value: {
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
