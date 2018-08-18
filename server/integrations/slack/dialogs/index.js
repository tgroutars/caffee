const SlackClient = require('@slack/client').WebClient;

const registerBackgroundTask = require('../../../lib/queue/registerBackgroundTask');
const dialogs = require('./dialogs');
const HashStore = require('../../../lib/redis/HashStore');

const callbackIdStore = new HashStore('slack:callback_id');

const slackDialogOpen = registerBackgroundTask(
  'slack_dialog_open',
  async (accessToken, args) => {
    const slackClient = new SlackClient(accessToken);
    await slackClient.dialog.open(args);
  },
);

const preProcessDialog = async rawDialog => ({
  ...rawDialog,
  callback_id: await callbackIdStore.set(rawDialog.callback_id),
});

const openDialog = type => {
  const getDialog = dialogs[type];
  if (!getDialog) {
    throw new Error(`Unknown dialog type: ${type}`);
  }

  return (...dialogArgs) => {
    const rawDialog = getDialog(...dialogArgs);

    return async ({ accessToken, triggerId }) => {
      const dialog = await preProcessDialog(rawDialog);
      const dialogJSON = JSON.stringify(dialog);
      await slackDialogOpen(accessToken, {
        dialog: dialogJSON,
        trigger_id: triggerId,
      });
    };
  };
};

module.exports = { openDialog };
