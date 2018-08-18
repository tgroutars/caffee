const { FeedbackComment } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

module.exports = () => ({
  async create({
    authorId,
    text,
    feedbackId,
    feedbackExternalRefId,
    attachments,
  }) {
    const comment = await FeedbackComment.create({
      authorId,
      text,
      feedbackId,
      feedbackExternalRefId,
      attachments,
    });
    await trigger('feedback_comment_created', {
      feedbackCommentId: comment.id,
    });
  },
});
