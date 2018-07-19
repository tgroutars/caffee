module.exports = ({ productId }) => {
  const callbackId = {
    type: 'create_channel',
    productId,
  };

  const elements = [
    {
      label: 'Channel',
      name: 'channel',
      type: 'text',
      value: '#product-updates',
      hint: `Choose a name for the channel where I'll post updates`,
      max_length: 150, // Maximum imposed by Slack
      optional: false,
    },
  ];

  return {
    callback_id: callbackId,
    title: 'New channel',
    submit_label: 'Confirm',
    elements,
  };
};
