const actions = require('./actions');
const { decode } = require('../../helpers/encoding');
const registerBackgroundTask = require('../../../../lib/queue/registerBackgroundTask');

const messageAction = async (payload, state) => {
  const action = actions[payload.callback_id];

  if (typeof action !== 'function') {
    throw new Error(`Unknow message action: ${payload.callback_id}`);
  }
  const { workspace } = state;
  payload.message.text = await decode(workspace)(payload.message.text);
  await action(payload, state);
};

module.exports = registerBackgroundTask(messageAction);
