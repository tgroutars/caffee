const { Feedback: FeedbackService } = require('../../../../../services');

const addFeedbackToBacklogItem = async payload => {
  const { action } = payload;
  const {
    selected_options: [
      {
        value: { backlogItemId },
      },
    ],
    name: { feedbackId },
  } = action;
  await FeedbackService.setBacklogItem(feedbackId, { backlogItemId });
};

module.exports = addFeedbackToBacklogItem;
