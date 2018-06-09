const { SlackWorkspace } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');

const openFeedbackDialogHelper = openDialog('feedback');

const openFeedbackDialog = async payload => {
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

  await openFeedbackDialogHelper({ productId })({ accessToken, triggerId });
};

module.exports = openFeedbackDialog;
