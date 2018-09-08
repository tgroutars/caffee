const { Feedback: FeedbackService } = require('../../../../../services');
const { Feedback, ProductUser } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { SlackPermissionError } = require('../../../../../lib/errors');

const addFeedbackToRoadmapItem = async (
  payload,
  { workspace, slackUser, user },
) => {
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

  const productUser = await ProductUser.find({
    where: { productId: feedback.productId, userId: user.id },
  });
  if (!productUser || !productUser.isPM) {
    throw new SlackPermissionError();
  }

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
