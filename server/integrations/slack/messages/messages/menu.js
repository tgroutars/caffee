const menu = ({
  productId,
  defaultText,
  defaultAuthorId,
  defaultAuthorName,
  createBacklogItem = false,
}) => {
  const pretext = 'Hi there :wave: What do you want to do?';
  const actions = [
    {
      type: 'button',
      text: 'Send a new feedback',
      value: 'open_feedback_dialog',
      name: {
        productId,
        defaultAuthorId,
        defaultAuthorName,
        defaultFeedback: defaultText,
        type: 'open_feedback_dialog',
      },
    },
  ];
  if (createBacklogItem) {
    actions.push({
      type: 'button',
      text: 'Create a new backlog item',
      value: 'open_backlog_item_dialog',
      name: {
        productId,
        defaultDescription: defaultText,
        type: 'open_backlog_item_dialog',
      },
    });
  }
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
