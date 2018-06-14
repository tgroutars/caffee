const menu = ({ productId, defaultFeedback }) => {
  const pretext = 'Hi there :wave: What do you want to do?';
  const actions = [
    {
      type: 'button',
      text: 'Send a new feedback',
      name: 'open_feedback_dialog',
      style: 'primary',
      value: {
        productId,
        defaultFeedback,
      },
    },
  ];
  return {
    attachments: [
      {
        pretext,
        actions,
        callback_id: 'menu',
      },
    ],
  };
};

module.exports = menu;
