const trim = require('lodash/trim');

const { Feedback: FeedbackService } = require('../../../../../services');

const archiveFeedbackReason = async payload => {
  const { submission, callback_id: callbackId } = payload;
  const { feedbackId } = callbackId;
  const archiveReason = trim(submission.archiveReason);
  await FeedbackService.archive(feedbackId, { archiveReason });
};

module.exports = archiveFeedbackReason;
