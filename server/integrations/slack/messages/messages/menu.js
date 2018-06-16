const menu = ({ productId, defaultFeedback }) => {
  const pretext = 'Hi there :wave: What do you want to do?';
  const actions = [
    {
      type: 'button',
      text: 'Send a new feedback',
      value: 'open_feedback_dialog',
      style: 'primary',
      name: {
        type: 'open_feedback_dialog',
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
