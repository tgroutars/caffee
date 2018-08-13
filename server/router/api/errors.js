class APIError extends Error {
  constructor(type) {
    super();
    this.type = type;
  }
}

class UnknownError extends Error {}

module.exports = {
  APIError,
  UnknownError,
};
