const dialogSubmission = require('./dialogSubmission');
const interactiveMessage = require('./interactiveMessage');
const messageAction = require('./messageAction');
const { SlackUser, SlackWorkspace } = require('../../../models');

const handleAction = async payload => {
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

  const state = { workspace, slackUser, user };

  switch (payload.type) {
    case 'interactive_message':
      return interactiveMessage(payload, state);
    case 'dialog_submission':
      return dialogSubmission(payload, state);
    case 'message_action':
      return messageAction(payload, state);
    default:
      throw new Error(`Unknown action type: ${payload.type}`);
  }
};

module.exports = { handleAction };
