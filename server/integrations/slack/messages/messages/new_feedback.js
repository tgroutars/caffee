const getRoadmapItemAttachment = require('../attachments/roadmap_item');

const newFeedback = ({
  feedback,
  product,
  roadmapItem,
  author,
  roadmapItemOptions = {},
}) => {
  const { archivedAt } = feedback;
  let actions;
  if (!feedback.archivedAt && !roadmapItem) {
    actions = [
      {
        type: 'button',
        value: 'open_roadmap_item_dialog',
        name: {
          type: 'open_roadmap_item_dialog_from_feedback',
          feedbackId: feedback.id,
          defaultDescription: feedback.description,
        },
        text: 'New roadmap item',
        style: 'primary',
      },
      {
        name: {
          type: 'add_feedback_to_roadmap_item',
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
  if (roadmapItem) {
    attachments.push({
      ...getRoadmapItemAttachment({ roadmapItem, ...roadmapItemOptions }),
      pretext: '*_Associated roadmap item:_*',
    });
  }
  return {
    text: `*_${author.name} added a new feedback on ${product.name}_*`,
    attachments,
  };
};

module.exports = newFeedback;
