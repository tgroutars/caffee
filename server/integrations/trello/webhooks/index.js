const registerBackgroundTask = require('../../../lib/queue/registerBackgroundTask');
const actions = require('./actions');

const handleWebhook = registerBackgroundTask(async payload => {
  const { type } = payload.action;
  const action = actions[type];
  if (typeof action !== 'function') {
    return;
  }
  await action(payload);
});

module.exports = { handleWebhook };
