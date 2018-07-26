const { openDialog } = require('../../../dialogs');

const openCreateChannelDialog = openDialog('create_channel');

module.exports = async (payload, { workspace }) => {
  const { trigger_id: triggerId, action } = payload;
  const { slackInstallId } = action.name;
  const { accessToken } = workspace;
  await openCreateChannelDialog({
    slackInstallId,
  })({
    accessToken,
    triggerId,
  });
};
