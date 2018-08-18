const { Feedback: FeedbackService } = require('../../../../../services');
const { Feedback } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

const addFeedbackToRoadmapItem = async (payload, { workspace, slackUser }) => {
  const {
    action,
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
};

module.exports = addFeedbackToRoadmapItem;
