const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const { Feedback: FeedbackService } = require('../../../../../services');

const createFeedbackBG = registerBackgroundTask(
  async (userSlackId, workspaceSlackId, productId, { description, authorId }) =>
    FeedbackService.create({ description, productId, authorId }),
);

const feedback = async payload => {
  const {
    submission,
    callback_id: callbackId,
    user: { id: userSlackId },
    team: { id: workspaceSlackId },
  } = payload;
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

  await createFeedbackBG(userSlackId, workspaceSlackId, productId, {
    description,
    authorId,
  });
};

module.exports = feedback;
