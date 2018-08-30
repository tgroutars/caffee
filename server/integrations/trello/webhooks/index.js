const registerBackgroundTask = require('../../../lib/registerBackgroundTask');
const actions = require('./actions');

const handleWebhook = registerBackgroundTask(
  'trello_handle_webhook',
  async payload => {
    const { type } = payload.action;
    const action = actions[type];
    if (typeof action !== 'function') {
      return;
    }
    await action(payload);
  },
);

module.exports = { handleWebhook };
