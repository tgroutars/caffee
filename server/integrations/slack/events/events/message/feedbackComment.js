const { FeedbackExternalRef, SlackUser } = require('../../../../../models');
const {
  FeedbackComment: FeedbackCommentService,
} = require('../../../../../services');

module.exports = async (payload, { workspace }) => {
  const { event } = payload;
  const { thread_ts: threadTS, channel, text, user: userSlackId } = event;

  if (!threadTS || userSlackId === workspace.appUserId) {
    return;
  }
  const messageRef = `slack:${workspace.slackId}_${channel}_${threadTS}`;

  const feedbackExternalRef = await FeedbackExternalRef.find({
    where: { ref: messageRef },
  });
  if (!feedbackExternalRef) {
    return;
  }

  const slackUser = await SlackUser.find({
    where: {
      workspaceId: workspace.id,
      slackId: userSlackId,
    },
  });
  await FeedbackCommentService.create({
    text,
    feedbackId: feedbackExternalRef.feedbackId,
    authorId: slackUser.userId,
    feedbackExternalRefId: feedbackExternalRef.id,
  });
};
