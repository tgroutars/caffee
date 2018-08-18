const trim = require('lodash/trim');

const { Feedback: FeedbackService } = require('../../../../../services');
const { SlackUser } = require('../../../../../models');

const archiveFeedbackReason = async payload => {
  const {
    submission,
    callback_id: callbackId,
    user: { id: userSlackId },
  } = payload;
  const { feedbackId } = callbackId;
  const archivedBySlackUser = await SlackUser.find({
    where: { slackId: userSlackId },
  });

  const archiveReason = trim(submission.archiveReason);
  await FeedbackService.archive(feedbackId, {
    archiveReason,
    archivedById: archivedBySlackUser.userId,
  });
};

module.exports = archiveFeedbackReason;
