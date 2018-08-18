/* eslint-disable no-lonely-if */

const newFeedback = ({
  userTo,
  feedback,
  product,
  roadmapItem,
  author,
  createdBy,
  assignedTo,
}) => {
  const isAuthor = userTo.id === author.id;
  const isAssigned = userTo.id === assignedTo.id;
  const isCreator = userTo.id === createdBy.id;
  const isOnBehalf = author.id !== createdBy.id;
  const { archivedAt } = feedback;

  let text;
  if (isCreator) {
    if (isAuthor) {
      text = `You added a new feedback on ${product.name}`;
    } else {
      text = `You added a feedback on ${product.name} on behalf of *${
        author.name
      }*`;
    }
  } else {
    if (isAuthor) {
      text = `*${createdBy.name}* added a new feedback on ${
        product.name
      } on your behalf`;
    } else {
      if (isOnBehalf) {
        text = `*${createdBy.name}* added a new feedback on ${
          product.name
        } on behalf of *${author.name}*`;
      } else {
        text = `*${author.name}* added a new feedback on ${product.name}`;
      }
    }
  }
  text = `${text}\nReply in this thread to discuss it :point_down:`;

  let actions;
  if (isAssigned && !archivedAt && !roadmapItem) {
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
  const imageAttachment = feedback.attachments.find(attachment =>
    (attachment.mimetype || '').startsWith('image/'),
  );
  let footer;
  if (roadmapItem) {
    footer = ':thumbsup: This feedback is already processed';
  } else if (feedback.archivedAt) {
    footer = ':man-gesturing-no: This feedback is archived';
  }
  const attachments = [
    {
      text: feedback.description,
      color: '#f2d600',
      callback_id: 'feedback',
      image_url: imageAttachment ? imageAttachment.url : undefined,
      footer,
      actions,
    },
  ];
  return {
    text,
    attachments,
    footer,
  };
};

module.exports = newFeedback;
