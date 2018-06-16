const { SlackWorkspace } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');

const openArchiveReasonDialog = openDialog('archive_feedback_reason');

const archiveFeedback = async payload => {
  const {
    team: { id: workspaceSlackId },
    trigger_id: triggerId,
    action,
  } = payload;

  const { feedbackId } = action.name;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const { accessToken } = workspace;

  await openArchiveReasonDialog({ feedbackId })({
    accessToken,
    triggerId,
  });
};

module.exports = archiveFeedback;
