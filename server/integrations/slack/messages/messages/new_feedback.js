const newFeedback = ({ feedback, product }) => ({
  text: `New feedback on ${product.name}`,
  attachments: [
    {
      text: feedback.description,
      callback_id: 'new_feedback',
      actions: [
        {
          type: 'button',
          value: 'open_backlog_item_dialog',
          name: {
            type: 'open_backlog_item_dialog',
            feedbackId: feedback.id,
          },
          text: 'New backlog item',
          style: 'primary',
        },
        {
          name: {
            type: 'add_feedback_to_backlog_item',
            feedbackId: feedback.id,
            productId: product.id,
          },
          text: 'Add to existing item',
          type: 'select',
          data_source: 'external',
        },
        {
          type: 'button',
          value: 'archive_feedback',
          name: {
            type: 'archive_feedback',
            feedbackId: feedback.id,
          },
          text: 'Archive',
          style: 'danger',
        },
      ],
    },
  ],
});

module.exports = newFeedback;
