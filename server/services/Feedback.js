const { Feedback } = require('../models');

const FeedbackService = (/* services */) => ({
  async create({ description, authorId, productId }) {
    const feedback = await Feedback.create({
      authorId,
      productId,
      description,
    });
    return feedback;
  },
});

FeedbackService.key = 'Feedback';

module.exports = FeedbackService;
