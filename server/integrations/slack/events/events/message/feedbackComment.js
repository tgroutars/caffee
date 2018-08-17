const { FeedbackExternalRef } = require('../../../../../models');

module.exports = async (payload, { workspace }) => {
  const { event } = payload;
  const { thread_ts: threadTS, channel } = event;
  if (!threadTS) {
    return;
  }
  const messageRef = `slack:${workspace.slackId}_${channel}_${threadTS}`;

  const feedbackExternalRef = await FeedbackExternalRef.find({
    where: { ref: messageRef },
    include: ['feedback'],
  });
  if (!feedbackExternalRef) {
    return;
  }
};
