const SlackClient = require('@slack/client').WebClient;
const dialogs = require('./dialogs');
const HashStore = require('../../../lib/redis/HashStore');

const callbackIdStore = new HashStore('slack:callback_id');

const openDialog = type => {
  const getDialog = dialogs[type];
  if (!getDialog) {
    throw new Error(`Unknown dialog type: ${type}`);
  }

  return (...dialogArgs) => {
    const rawDialog = getDialog(...dialogArgs);

    return async ({ accessToken, triggerId }) => {
      const dialog = {
        ...rawDialog,
        callback_id: await callbackIdStore.set(rawDialog.callback_id),
      };
      const slackClient = new SlackClient(accessToken);
      const dialogJSON = JSON.stringify(dialog);
      return slackClient.dialog.open({
        dialog: dialogJSON,
        trigger_id: triggerId,
      });
    };
  };
};

module.exports = { openDialog };
