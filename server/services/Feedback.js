const { Feedback, sequelize } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

const FeedbackService = services => ({
  async create({ description, authorId, productId }) {
    const feedback = await Feedback.create({
      authorId,
      productId,
      description,
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

  async archive(feedbackId, { archiveReason }) {
    await Feedback.update(
      { archivedAt: sequelize.fn('NOW'), archiveReason },
      { where: { id: feedbackId } },
    );
  },
});

module.exports = FeedbackService;
