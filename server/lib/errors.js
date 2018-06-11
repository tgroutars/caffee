class SlackDialogSubmissionError extends Error {
  constructor(errors) {
    super('Dialog submission error');
    this.errors = errors;
  }
}

module.exports = {
  SlackDialogSubmissionError,
};
