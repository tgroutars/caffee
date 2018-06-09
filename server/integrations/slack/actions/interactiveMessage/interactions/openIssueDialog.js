const { SlackWorkspace } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');

const openNewIssueDialog = openDialog('new_issue');

const openIssueDialog = async payload => {
  const {
    team: { id: workspaceSlackId },
    trigger_id: triggerId,
    action,
  } = payload;

  const { productId } = action.value;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const { accessToken } = workspace;

  await openNewIssueDialog({ productId })({ accessToken, triggerId });
};

module.exports = openIssueDialog;
