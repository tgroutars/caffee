const { SlackWorkspace } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');

const openFeedbackDialogHelper = openDialog('feedback');

const openFeedbackDialog = async payload => {
  const {
    team: { id: workspaceSlackId },
    trigger_id: triggerId,
    action,
  } = payload;

  const { productId, defaultFeedback } = action.value;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const { accessToken } = workspace;

  await openFeedbackDialogHelper({ productId, defaultFeedback })({
    accessToken,
    triggerId,
  });
};

module.exports = openFeedbackDialog;
