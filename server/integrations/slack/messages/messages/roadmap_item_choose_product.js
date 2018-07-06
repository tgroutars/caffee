const roadmapItemChooseProduct = ({
  products,
  defaultTitle = '',
  defaultDescription = '',
}) => {
  const pretext = 'In which roadmap do you want to send this?';
  const actions = products.map(product => ({
    type: 'button',
    text: product.name,
    value: 'open_roadmap_item_dialog',
    name: {
      defaultTitle,
      defaultDescription,
      type: 'open_roadmap_item_dialog',
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

module.exports = roadmapItemChooseProduct;
