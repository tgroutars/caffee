const trim = require('lodash/trim');

const { updateMessage } = require('../../../messages');
const { Feedback: FeedbackService } = require('../../../../../services');
const { Feedback } = require('../../../../../models');

const archiveFeedbackReason = async (payload, { workspace }) => {
  const { submission, callback_id: callbackId } = payload;
  const { feedbackId, feedbackMessageRef } = callbackId;

  const archiveReason = trim(submission.archiveReason);
  await FeedbackService.archive(feedbackId, { archiveReason });

  if (feedbackMessageRef) {
    const feedback = await Feedback.findById(feedbackId, {
      include: ['product', 'author'],
    });
    const { product, author } = feedback;
    await updateMessage('new_feedback')({
      feedback,
      product,
      author,
    })({
      accessToken: workspace.accessToken,
      channel: feedbackMessageRef.channel,
      ts: feedbackMessageRef.ts,
    });
  }
};

module.exports = archiveFeedbackReason;
