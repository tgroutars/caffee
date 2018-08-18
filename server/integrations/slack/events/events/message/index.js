const Promise = require('bluebird');

// TODO: Rename these to make what they do clearer
const appHome = require('./app_home');
const channel = require('./channel');
const feedbackComment = require('./feedbackComment');

const handlers = [appHome, channel, feedbackComment];

const message = async (payload, state) =>
  Promise.map(handlers, async handler => handler(payload, state));

module.exports = message;
