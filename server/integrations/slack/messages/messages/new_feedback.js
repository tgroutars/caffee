const newFeedback = ({ feedback, product }) => ({
  text: `New feedback on ${product.name}`,
  attachments: [
    {
      text: feedback.description,
      callback_id: 'new_feedback',
      actions: [
        {
          type: 'button',
          name: 'open_backlog_item_dialog',
          value: {
            feedbackId: feedback.id,
          },
          text: 'New backlog item',
          style: 'primary',
        },
      ],
    },
  ],
});

module.exports = newFeedback;
