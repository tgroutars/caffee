const actions = require('./actions');

const messageAction = async (payload, state) => {
  const action = actions[payload.callback_id];

  if (typeof action !== 'function') {
    throw new Error(`Unknow message action: ${payload.callback_id}`);
  }

  await action(payload, state);
};

module.exports = messageAction;
