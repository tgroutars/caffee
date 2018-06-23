const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const { Feedback: FeedbackService } = require('../../../../../services');

const createFeedbackBG = registerBackgroundTask(
  FeedbackService.create.bind(FeedbackService),
);

const feedback = async payload => {
  const { submission, callback_id: callbackId } = payload;
  const { productId, defaultAuthorId } = callbackId;
  const authorId = submission.authorId || defaultAuthorId;
  const description = trim(submission.description);
  if (!description) {
    throw new SlackDialogSubmissionError([
      {
        name: 'description',
        error: 'This field is required',
      },
    ]);
  }
  if (!authorId) {
    throw new Error('Missing authorId in feedback submission');
  }
  await createFeedbackBG({
    description,
    authorId,
    productId,
  });
};

module.exports = feedback;
