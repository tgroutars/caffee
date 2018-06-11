const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const { findOrFetchSlackUser } = require('../../../helpers/user');
const { Feedback: FeedbackService } = require('../../../../../services');

const createFeedbackBG = registerBackgroundTask(
  async (userSlackId, workspaceSlackId, productId, { description }) => {
    const slackUser = await findOrFetchSlackUser(userSlackId, workspaceSlackId);
    const feedback = await FeedbackService.create({
      description,
      productId,
      authorId: slackUser.userId,
    });
    return feedback;
  },
);

const feedback = async payload => {
  const {
    submission,
    callback_id: callbackId,
    user: { id: userSlackId },
    team: { id: workspaceSlackId },
  } = payload;
  const { productId } = callbackId;
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
  });
};

module.exports = feedback;
