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

class SlackPermissionError extends SlackUserError {
  constructor() {
    super(
      `You don't have the permission to do this. Contact an admin if think you should`,
    );
  }
}

module.exports = {
  SlackDialogSubmissionError,
  SlackUserError,
  SlackPermissionError,
};
