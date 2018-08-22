const Promise = require('bluebird');

const { FeedbackExternalRef, SlackUser } = require('../../../../../models');
const {
  FeedbackComment: FeedbackCommentService,
} = require('../../../../../services');
const { syncFile } = require('../../../helpers/files');

module.exports = async (payload, { workspace }) => {
  const { event } = payload;

  const {
    channel,
    text,
    files = [],
    user: userSlackId,
    thread_ts: threadTS,
  } = event;

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

  const attachments = await Promise.map(files, async file =>
    syncFile(file, workspace.accessToken),
  );

  const slackUser = await SlackUser.find({
    where: {
      workspaceId: workspace.id,
      slackId: userSlackId,
    },
  });
  await FeedbackCommentService.create({
    text,
    attachments,
    feedbackId: feedbackExternalRef.feedbackId,
    authorId: slackUser.userId,
    feedbackExternalRefId: feedbackExternalRef.id,
  });
};
