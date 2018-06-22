const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const {
  Feedback: FeedbackService,
  SlackUser: SlackUserService,
} = require('../../../../../services');

const createFeedbackBG = registerBackgroundTask(
  async (
    userSlackId,
    workspaceSlackId,
    productId,
    { description, authorId },
  ) => {
    const values = { description, productId };
    if (authorId) {
      values.authorId = authorId;
    } else {
      const slackUser = await SlackUserService.findOrFetch(
        userSlackId,
        workspaceSlackId,
      );
      values.authorId = slackUser.userId;
    }

    return FeedbackService.create(values);
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
  const { authorId } = submission;
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
