const interactiveMessage = require('./interactiveMessage');
const dialogSuggestion = require('./dialogSuggestion');

const optionsLoad = async payload => {
  const { type } = payload;

  switch (type) {
    case 'interactive_message':
      return interactiveMessage(payload);
    case 'dialog_suggestion':
      return dialogSuggestion(payload);
    default:
      throw new Error(`Unknown options-load type ${type}`);
  }
};

module.exports = optionsLoad;
