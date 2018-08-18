const { FeedbackExternalRef } = require('../models');

module.exports = () => ({
  async create({ feedbackId, ref, props }) {
    return FeedbackExternalRef.create({ feedbackId, ref, props });
  },
});
