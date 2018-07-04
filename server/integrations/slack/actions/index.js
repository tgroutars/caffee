const dialogSubmission = require('./dialogSubmission');
const interactiveMessage = require('./interactiveMessage');
const messageAction = require('./messageAction');
const registerBackgroundTask = require('../../../lib/queue/registerBackgroundTask');
const { SlackUser, SlackWorkspace } = require('../../../models');

const handleAction = registerBackgroundTask(async payload => {
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
    return;
  }

  const { workspace, user } = slackUser;

  const state = { workspace, slackUser, user };

  switch (payload.type) {
    case 'interactive_message':
      await interactiveMessage(payload, state);
      break;
    case 'dialog_submission':
      await dialogSubmission(payload, state);
      break;
    case 'message_action':
      await messageAction(payload, state);
      break;
    default:
      throw new Error(`Unknown action type: ${payload.type}`);
  }
});

module.exports = { handleAction };
