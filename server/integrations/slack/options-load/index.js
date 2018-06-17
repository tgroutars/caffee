const Promise = require('bluebird');
const HashStore = require('../../../lib/redis/HashStore');
const actions = require('./actions');

const actionValueStore = new HashStore('slack:action_value');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => {
  const name = await actionValueStore.get(payload.name);
  if (!name) {
    throw new Error('This action has expired');
  }
  return {
    ...payload,
    name,
  };
};

// Store option values in Redis
const postProcessOptions = async options =>
  Promise.map(options, async option => ({
    ...option,
    value: await actionValueStore.set(option.value),
  }));

const optionsLoad = async rawPayload => {
  const payload = await preProcessPayload(rawPayload);
  const action = actions[payload.name.type];
  if (!action) {
    throw new Error(`Unknown select action type: ${payload.name}`);
  }
  const options = await action(payload);
  return { options: await postProcessOptions(options) };
};

module.exports = optionsLoad;
