const getBacklogItemAttachment = require('../attachments/backlog_item');

const newFeedback = ({
  feedback,
  product,
  backlogItem,
  backlogItemOptions = {},
}) => {
  const { archivedAt } = feedback;
  let actions;
  if (!feedback.archivedAt && !backlogItem) {
    actions = [
      {
        type: 'button',
        value: 'open_backlog_item_dialog',
        name: {
          type: 'open_backlog_item_dialog_from_feedback',
          feedbackId: feedback.id,
          defaultDescription: feedback.description,
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
    ];
  }
  const attachments = [
    {
      text: feedback.description,
      color: '#f2d600',
      callback_id: 'new_feedback',
      footer: archivedAt
        ? ':no_entry_sign: This feedback has been archived'
        : undefined,
      actions,
    },
  ];
  if (backlogItem) {
    attachments.push({
      ...getBacklogItemAttachment({ backlogItem, ...backlogItemOptions }),
      pretext: '*_Associated backlog item:_*',
    });
  }
  return {
    text: `*_New feedback on ${product.name}_*`,
    attachments,
  };
};

module.exports = newFeedback;
