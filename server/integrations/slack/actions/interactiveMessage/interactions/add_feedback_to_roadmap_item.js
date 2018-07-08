const { Feedback: FeedbackService } = require('../../../../../services');
const { Feedback } = require('../../../../../models');
const { updateMessage, postEphemeral } = require('../../../messages');

const addFeedbackToRoadmapItem = async (payload, { workspace, slackUser }) => {
  const {
    action,
    original_message: originalMessage,
    channel: { id: channel },
  } = payload;
  const {
    selected_options: [
      {
        value: { roadmapItemId },
      },
    ],
    name: { feedbackId },
  } = action;
  const feedback = await Feedback.findById(feedbackId);
  const { accessToken } = workspace;

  if (feedback.roadmapItemId || feedback.archivedAt) {
    await postEphemeral('feedback_already_processed')({ feedback })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  } else {
    await FeedbackService.setRoadmapItem(feedbackId, {
      roadmapItemId,
      processedById: slackUser.userId,
    });
  }

  await feedback.reload({
    include: ['roadmapItem', 'product', 'author'],
  });
  const { roadmapItem, product, author } = feedback;
  const { ts } = originalMessage;

  await updateMessage('new_feedback')({
    feedback,
    roadmapItem,
    product,
    author,
  })({
    accessToken,
    channel,
    ts,
  });
};

module.exports = addFeedbackToRoadmapItem;
