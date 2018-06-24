const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const { Feedback: FeedbackService } = require('../../../../../services');
const { SlackWorkspace, SlackUser, User } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');

const createFeedbackBG = registerBackgroundTask(
  FeedbackService.create.bind(FeedbackService),
);

const feedback = async payload => {
  const {
    team: { id: workspaceSlackId },
    user: { id: userSlackId },
    channel: { id: channel },
    submission,
    callback_id: callbackId,
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
  if (!authorId) {
    throw new Error('Missing authorId in feedback submission');
  }
  await createFeedbackBG({
    description,
    authorId,
    productId,
  });
  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId },
    include: [
      {
        model: SlackWorkspace,
        as: 'workspace',
        where: { slackId: workspaceSlackId },
      },
    ],
  });
  const { workspace } = slackUser;
  const { accessToken } = workspace;
  const isAuthor = slackUser.userId === authorId;
  const author = await User.findById(authorId);
  await postEphemeral('feedback_thanks')({ isAuthor, author })({
    accessToken,
    channel,
    user: userSlackId,
  });
};

module.exports = feedback;
