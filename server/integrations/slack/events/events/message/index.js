// TODO: Rename these to make what they do clearer
const appHome = require('./app_home');
const channel = require('./channel');

const handlers = [appHome, channel];

const message = async (payload, state) => {
  handlers.forEach(handler => handler(payload, state));
};

module.exports = message;
