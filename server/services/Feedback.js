const { Feedback, sequelize } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

const FeedbackService = services => ({
  async create({ description, authorId, productId, attachments, createdById }) {
    const feedback = await Feedback.create({
      authorId,
      productId,
      description,
      createdById,
      attachments,
    });

    trigger('feedback_created', { feedbackId: feedback.id });

    return feedback;
  },

  async setRoadmapItem(feedbackId, { roadmapItemId, processedById }) {
    const feedback = await Feedback.findById(feedbackId);
    await feedback.update({ roadmapItemId });
    await services.RoadmapItem.addFollower(roadmapItemId, feedback.authorId);
    await trigger('feedback_processed', { feedbackId, processedById });
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
