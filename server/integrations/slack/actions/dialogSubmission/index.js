const { SlackDialogSubmissionError } = require('../../../../lib/errors');
const ObjectStore = require('../../../../lib/redis/ObjectStore');
const dialogs = require('./dialogs');

const callbackIdStore = new ObjectStore('slack:callback_id');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => ({
  ...payload,
  callback_id: await callbackIdStore.get(payload.callback_id),
});

const dialogSubmission = async rawPayload => {
  const payload = await preProcessPayload(rawPayload);
  const { type } = payload.callback_id;
  const dialog = dialogs[type];
  if (typeof dialog !== 'function') {
    throw new Error(`Unknown dialog submission type: ${type}`);
  }

  try {
    await dialog(payload);
  } catch (err) {
    if (err instanceof SlackDialogSubmissionError) {
      return { errors: err.errors };
    }
    throw err;
  }
  return null;
};

module.exports = dialogSubmission;
