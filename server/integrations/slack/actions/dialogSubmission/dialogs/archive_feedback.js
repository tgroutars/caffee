const trim = require('lodash/trim');

const { Feedback: FeedbackService } = require('../../../../../services');
const { SlackUser, Feedback, ProductUser } = require('../../../../../models');
const {
  SlackUserError,
  SlackPermissionError,
} = require('../../../../../lib/errors');

module.exports = async (payload, { user }) => {
  const {
    submission,
    callback_id: callbackId,
    user: { id: userSlackId },
  } = payload;
  const { feedbackId } = callbackId;
  const feedback = await Feedback.findById(feedbackId);
  if (feedback.archivedAt) {
    throw new SlackUserError(`This feedback is already archived`);
  }
  const productUser = await ProductUser.find({
    where: { userId: user.id, productId: feedback.productId },
  });
  if (!productUser || !productUser.isPM) {
    throw new SlackPermissionError();
  }

  const archivedBySlackUser = await SlackUser.find({
    where: { slackId: userSlackId },
  });

  const archiveReason = trim(submission.archiveReason);
  await FeedbackService.archive(feedbackId, {
    archiveReason,
    archivedById: archivedBySlackUser.userId,
  });
};
