const { openDialog } = require('../../../dialogs');
const { SlackInstall, ProductUser } = require('../../../../../models');
const { SlackPermissionError } = require('../../../../../lib/errors');

const openCreateChannelDialog = openDialog('create_channel');

module.exports = async (payload, { workspace, user }) => {
  const { trigger_id: triggerId, action } = payload;
  const { slackInstallId } = action.name;
  const { accessToken } = workspace;

  const slackInstall = await SlackInstall.findById(slackInstallId);
  const productUser = await ProductUser.find({
    where: { productId: slackInstall.productId, userId: user.id },
  });
  if (!productUser || !productUser.isAdmin) {
    throw new SlackPermissionError();
  }

  await openCreateChannelDialog({
    slackInstallId,
  })({
    accessToken,
    triggerId,
  });
};
