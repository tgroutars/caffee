const SlackClient = require('@slack/client').WebClient;
const dialogs = require('./dialogs');
const ObjectStore = require('../../../lib/redis/ObjectStore');

const callbackIdStore = new ObjectStore('slack:callback_id');

const openDialog = type => {
  const getDialog = dialogs[type];
  if (!getDialog) {
    throw new Error(`Unknown dialog type: ${type}`);
  }

  return dialogArgs => {
    const dialog = getDialog(dialogArgs);

    return async ({ accessToken, triggerId }) => {
      dialog.callback_id = await callbackIdStore.set(dialog.callback_id);

      const slackClient = new SlackClient(accessToken);
      const dialogJSON = JSON.stringify(dialog);
      return slackClient.dialog.open({
        dialog: dialogJSON,
        trigger_id: triggerId,
      });
    };
  };
};

module.exports = openDialog;
