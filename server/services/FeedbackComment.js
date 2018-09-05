const { FeedbackComment, Feedback } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

module.exports = () => ({
  async create({
    authorId,
    text,
    feedbackId,
    feedbackExternalRefId,
    attachments = [],
  }) {
    const comment = await FeedbackComment.create({
      authorId,
      text,
      feedbackId,
      feedbackExternalRefId,
      attachments,
    });
    await Feedback.increment('comments_count', { where: { id: feedbackId } });
    await trigger('feedback_comment_created', {
      feedbackCommentId: comment.id,
    });
    return comment;
  },
});
