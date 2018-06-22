const Promise = require('bluebird');
const HashStore = require('../../../../lib/redis/HashStore');
const elements = require('./elements');

const callbackIdStore = new HashStore('slack:callback_id');
const actionValueStore = new HashStore('slack:action_value');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => ({
  ...payload,
  callback_id: await callbackIdStore.get(payload.callback_id),
});

// Store option values in Redis
const postProcessOptions = async options =>
  Promise.map(options, async option => ({
    ...option,
    value: await actionValueStore.set(option.value),
  }));

const optionsLoad = async rawPayload => {
  const payload = await preProcessPayload(rawPayload);
  const { name, callback_id: callbackId } = payload;
  const type = `${callbackId.type}-${name}`;
  const action = elements[type];
  if (!action) {
    throw new Error(`Unknown select action type: ${type}`);
  }
  const options = await action(payload);
  return { options: await postProcessOptions(options) };
};

module.exports = optionsLoad;
