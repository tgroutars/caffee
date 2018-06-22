const HashStore = require('../../../../lib/redis/HashStore');
const elements = require('./elements');

const callbackIdStore = new HashStore('slack:callback_id');

/**
 * Retrieve callbackId from Redis
 */
const preProcessPayload = async payload => ({
  ...payload,
  callback_id: await callbackIdStore.get(payload.callback_id),
});

const optionsLoad = async rawPayload => {
  const payload = await preProcessPayload(rawPayload);
  const { name, callback_id: callbackId } = payload;
  const type = `${callbackId.type}-${name}`;
  const action = elements[type];
  if (!action) {
    throw new Error(`Unknown select action type: ${type}`);
  }
  const options = await action(payload);
  return { options };
};

module.exports = optionsLoad;
