module.exports = ({ productId, productName }) => {
  const callbackId = {
    type: 'product_name',
    productId,
  };

  const elements = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      value: productName,
      hint: 'Enter the name of your product',
      max_length: 150, // Maximum imposed by Slack
      optional: false,
    },
  ];

  return {
    callback_id: callbackId,
    title: 'Your product',
    submit_label: 'Confirm',
    elements,
  };
};
