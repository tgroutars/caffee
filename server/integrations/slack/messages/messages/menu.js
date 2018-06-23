const menu = ({
  productId,
  defaultText,
  defaultAuthorId,
  defaultAuthorName,
}) => {
  const pretext = 'Hi there :wave: What do you want to do?';
  const actions = [
    {
      type: 'button',
      text: 'Send a new feedback',
      value: 'open_feedback_dialog',
      style: 'primary',
      name: {
        productId,
        defaultAuthorId,
        defaultAuthorName,
        defaultFeedback: defaultText,
        type: 'open_feedback_dialog',
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
