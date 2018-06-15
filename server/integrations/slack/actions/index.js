const dialogSubmission = require('./dialogSubmission');
const interactiveMessage = require('./interactiveMessage');
const messageAction = require('./messageAction');

const handleAction = async payload => {
  switch (payload.type) {
    case 'interactive_message':
      return interactiveMessage(payload);
    case 'dialog_submission':
      return dialogSubmission(payload);
    case 'message_action':
      return messageAction(payload);
    default:
      throw new Error(`Unknown action type: ${payload.type}`);
  }
};

module.exports = { handleAction };
