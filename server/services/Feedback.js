const { Feedback, sequelize } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

const FeedbackService = services => ({
  async create({ description, authorId, productId, createdById }) {
    const feedback = await Feedback.create({
      authorId,
      productId,
      description,
      createdById,
    });

    trigger('feedback_created', { feedbackId: feedback.id });

    return feedback;
  },

  async setBacklogItem(feedbackId, { backlogItemId }) {
    const feedback = await Feedback.findById(feedbackId);
    await feedback.update({ backlogItemId });
    await services.BacklogItem.addFollower(backlogItemId, feedback.authorId);
    await trigger('feedback_processed', { feedbackId });
  },

  async archive(feedbackId, { archiveReason, archivedById }) {
    await Feedback.update(
      { archivedAt: sequelize.fn('NOW'), archiveReason },
      { where: { id: feedbackId } },
    );
    await trigger('feedback_archived', { feedbackId, archivedById });
  },
});

module.exports = FeedbackService;
