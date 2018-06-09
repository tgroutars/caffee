const { SlackWorkspace } = require('../../../models');
const { openDialog } = require('../dialogs');

const openIssueDialog = openDialog('new_issue');

const caffee = async ({
  workspaceSlackId,
  triggerId,
  // channel,
  // userSlackId,
}) => {
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['installs'],
  });
  const { installs, accessToken } = workspace;

  if (!installs.length) {
    return;
  }

  // TODO: handle several possible installs
  if (installs.length > 1) {
    return;
  }

  const install = installs[0];
  const { productId } = install;
  await openIssueDialog({ productId })({ accessToken, triggerId });
};

module.exports = caffee;
