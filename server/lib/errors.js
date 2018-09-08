class SlackDialogSubmissionError extends Error {
  constructor(errors) {
    super('Dialog submission error');
    this.errors = errors;
  }
}

class SlackUserError extends Error {
  constructor(message) {
    super('Slack user error');
    this.userMessage =
      typeof message === 'object' ? message : { text: message };
  }
}

module.exports = {
  SlackDialogSubmissionError,
  SlackUserError,
};
