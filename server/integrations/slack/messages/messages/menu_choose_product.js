const feedbackChooseProduct = ({ products }) => {
  const pretext = 'You have several products installed on this workspace';
  const text = 'Which product are you interested in?';
  const actions = products.map(product => ({
    type: 'button',
    text: product.name,
    name: 'send_menu',
    value: {
      productId: product.id,
    },
  }));
  return {
    attachments: [
      {
        actions,
        pretext,
        text,
        callback_id: 'menu_choose_product',
      },
    ],
  };
};

module.exports = feedbackChooseProduct;