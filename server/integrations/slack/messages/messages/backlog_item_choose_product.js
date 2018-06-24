const backlogItemChooseProduct = ({ products, defaultDescription = '' }) => {
  const pretext = 'In which backlog do you want to send this?';
  const actions = products.map(product => ({
    type: 'button',
    text: product.name,
    value: 'open_backlog_item_dialog',
    name: {
      defaultDescription,
      type: 'open_backlog_item_dialog',
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

module.exports = backlogItemChooseProduct;
