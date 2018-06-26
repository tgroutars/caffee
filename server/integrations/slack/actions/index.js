const dialogSubmission = require('./dialogSubmission');
const interactiveMessage = require('./interactiveMessage');
const messageAction = require('./messageAction');

const handleAction = async (payload, state) => {
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
