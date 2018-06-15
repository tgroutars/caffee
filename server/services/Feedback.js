const { Feedback } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

const FeedbackService = (/* services */) => ({
  async create({ description, authorId, productId }) {
    const feedback = await Feedback.create({
      authorId,
      productId,
      description,
    });

    trigger('feedback_created', { feedbackId: feedback.id });

    return feedback;
  },
});

module.exports = FeedbackService;
