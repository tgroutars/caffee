const actions = require('./actions');
const { decode } = require('../../helpers/encoding');
const registerBackgroundTask = require('../../../../lib/queue/registerBackgroundTask');
const { SlackUser, SlackWorkspace } = require('../../../../models');

const messageAction = registerBackgroundTask(async payload => {
  const {
    message,
    callback_id: callbackId,
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
    return;
  }

  const { workspace, user } = slackUser;

  const action = actions[callbackId];

  if (typeof action !== 'function') {
    throw new Error(`Unknow message action: ${callbackId}`);
  }

  message.text = await decode(workspace)(message.text);
  await action(payload, { workspace, slackUser, user });
});

module.exports = messageAction;
