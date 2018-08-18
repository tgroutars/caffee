const Promise = require('bluebird');

const { SlackDialogSubmissionError } = require('../../../../lib/errors');
const HashStore = require('../../../../lib/redis/HashStore');
const dialogs = require('./dialogs');
const { SlackUser, SlackWorkspace, User } = require('../../../../models');
const registerBackgroundTask = require('../../../../lib/queue/registerBackgroundTask');

const callbackIdStore = new HashStore('slack:callback_id');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => ({
  ...payload,
  callback_id: await callbackIdStore.get(payload.callback_id),
});

const validateDialog = async (payload, state) => {
  const { type } = payload.callback_id;
  const dialog = dialogs[type];

  if (typeof dialog.validate !== 'function') {
    return;
  }

  await dialog.validate(payload, state);
};

const runDialog = registerBackgroundTask(
  'run_dialog',
  async (payload, { workspaceId, slackUserId, userId }) => {
    const { type } = payload.callback_id;
    const dialog = dialogs[type];
    const run = dialog.run || dialog;

    const [workspace, slackUser, user] = await Promise.all([
      SlackWorkspace.findById(workspaceId),
      SlackUser.findById(slackUserId),
      User.findById(userId),
    ]);
    await run(payload, { workspace, slackUser, user });
  },
);

const dialogSubmission = async rawPayload => {
  const payload = await preProcessPayload(rawPayload);
  const { type } = payload.callback_id;
  const dialog = dialogs[type];

  if (!dialog) {
    throw new Error(`Unknown dialog submission type: ${type}`);
  }

  const {
    team: { id: workspaceSlackId },
    user: { id: userSlackId },
  } = payload;

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId },
    include: [
      'user',
      {
        model: SlackWorkspace,
        as: 'workspace',
        where: { slackId: workspaceSlackId },
      },
    ],
  });
  if (!slackUser) {
    return null;
  }
  const { workspace, user } = slackUser;
  try {
    await validateDialog(payload, { workspace, slackUser, user });
  } catch (err) {
    if (err instanceof SlackDialogSubmissionError) {
      return { errors: err.errors };
    }
    throw err;
  }

  await runDialog(payload, {
    workspaceId: workspace.id,
    slackUserId: slackUser.id,
    userId: user.id,
  });
  return null;
};

module.exports = dialogSubmission;
