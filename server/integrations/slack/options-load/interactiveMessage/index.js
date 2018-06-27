const Promise = require('bluebird');
const HashStore = require('../../../../lib/redis/HashStore');
const actions = require('./actions');

const actionValueStore = new HashStore('slack:action_value');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => {
  const name = await actionValueStore.get(payload.name);
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

  const { name } = payload;
  if (!name) {
    return { options: [] };
  }
  const type = typeof name === 'string' ? name : name.type;
  const action = actions[type];
  if (!action) {
    throw new Error(`Unknown select action type: ${payload.name.type}`);
  }
  const options = await action(payload);
  return { options: await postProcessOptions(options) };
};

module.exports = optionsLoad;
