const trim = require('lodash/trim');
const Promise = require('bluebird');

const { syncFile } = require('../../../helpers/files');
const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const { Feedback: FeedbackService } = require('../../../../../services');
const { postEphemeral } = require('../../../messages');

const validate = async payload => {
  const { submission } = payload;
  const description = trim(submission.description);
  if (!description) {
    throw new SlackDialogSubmissionError([
      {
        name: 'description',
        error: 'This field is required',
      },
    ]);
  }
};

const run = async (payload, { slackUser, workspace }) => {
  const {
    channel: { id: channel },
    submission,
    callback_id: callbackId,
  } = payload;
  const { productId, defaultAuthorId, files = [], scopeId } = callbackId;
  const authorId = submission.authorId || defaultAuthorId;
  const description = trim(submission.description);

  const { accessToken } = workspace;

  if (files.length) {
    await postEphemeral('processing_feedback')()({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  }

  const attachments = await Promise.map(files, async file =>
    syncFile(file, accessToken),
  );

  if (!authorId) {
    throw new Error('Missing authorId in feedback submission');
  }

  await FeedbackService.create({
    description,
    authorId,
    productId,
    attachments,
    scopeId,
    createdById: slackUser.userId,
  });
};

module.exports = {
  validate,
  run,
};
