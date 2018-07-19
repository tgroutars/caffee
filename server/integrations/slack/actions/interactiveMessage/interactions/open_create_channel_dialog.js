const { openDialog } = require('../../../dialogs');

const openCreateChannelDialog = openDialog('create_channel');

module.exports = async (payload, { workspace }) => {
  const { trigger_id: triggerId, action } = payload;
  const { productId } = action.name;
  const { accessToken } = workspace;
  await openCreateChannelDialog({
    productId,
  })({
    accessToken,
    triggerId,
  });
};
