const Promise = require('bluebird');

const HashStore = require('../../../../lib/redis/HashStore');
const interactions = require('./interactions');

const actionValueStore = new HashStore('slack:action_value');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => {
  const {
    actions: [action],
  } = payload;
  return {
    ...payload,
    action: {
      ...action,
      name: action.name && (await actionValueStore.get(action.name)),
      value: action.value && (await actionValueStore.get(action.value)),
      selected_options:
        action.selected_options &&
        (await Promise.map(action.selected_options, async option => ({
          ...option,
          value: option.value && (await actionValueStore.get(option.value)),
        }))),
    },
  };
};

const interactiveMessage = async rawPayload => {
  const payload = await preProcessPayload(rawPayload);
  const { action } = payload;
  const name = typeof action.name === 'object' ? action.name.type : action.name;
  const interaction = interactions[name];
  if (typeof interaction !== 'function') {
    throw new Error(`Unknow interaction: ${name}`);
  }

  await interaction(payload);
};

module.exports = interactiveMessage;
