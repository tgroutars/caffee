const { SlackDialogSubmissionError } = require('../../../../lib/errors');
const HashStore = require('../../../../lib/redis/HashStore');
const dialogs = require('./dialogs');

const callbackIdStore = new HashStore('slack:callback_id');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => ({
  ...payload,
  callback_id: await callbackIdStore.get(payload.callback_id),
});

const dialogSubmission = async (rawPayload, state) => {
  const payload = await preProcessPayload(rawPayload);
  const { type } = payload.callback_id;
  const dialog = dialogs[type];
  if (typeof dialog !== 'function') {
    throw new Error(`Unknown dialog submission type: ${type}`);
  }

  try {
    await dialog(payload, state);
  } catch (err) {
    if (err instanceof SlackDialogSubmissionError) {
      return { errors: err.errors };
    }
    throw err;
  }
  return null;
};

module.exports = dialogSubmission;
