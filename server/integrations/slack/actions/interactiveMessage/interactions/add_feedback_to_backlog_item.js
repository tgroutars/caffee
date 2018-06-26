const { Feedback: FeedbackService } = require('../../../../../services');
const { Feedback } = require('../../../../../models');
const { updateMessage, postEphemeral } = require('../../../messages');

const addFeedbackToBacklogItem = async (payload, { workspace, slackUser }) => {
  const {
    action,
    original_message: originalMessage,
    channel: { id: channel },
  } = payload;
  const {
    selected_options: [
      {
        value: { backlogItemId },
      },
    ],
    name: { feedbackId },
  } = action;
  const feedback = await Feedback.findById(feedbackId);
  const { accessToken } = workspace;

  if (feedback.backlogItemId || feedback.archivedAt) {
    await postEphemeral('feedback_already_processed')({ feedback })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  } else {
    await FeedbackService.setBacklogItem(feedbackId, { backlogItemId });
  }

  await feedback.reload({ include: ['backlogItem', 'product'] });
  const { backlogItem, product } = feedback;
  const { ts } = originalMessage;

  await updateMessage('new_feedback')({
    feedback,
    backlogItem,
    product,
    backlogItemOptions: { openCard: true },
  })({
    accessToken,
    channel,
    ts,
  });
};

module.exports = addFeedbackToBacklogItem;
