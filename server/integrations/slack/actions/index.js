const dialogSubmission = require('./dialogSubmission');
const interactiveMessage = require('./interactiveMessage');

const handleAction = async payload => {
  switch (payload.type) {
    case 'interactive_message':
      return interactiveMessage(payload);
    case 'dialog_submission':
      return dialogSubmission(payload);
    default:
      throw new Error(`Unknown action type: ${payload.type}`);
  }
};

module.exports = { handleAction };
