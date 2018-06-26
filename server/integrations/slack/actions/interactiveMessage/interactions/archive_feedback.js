const { openDialog } = require('../../../dialogs');

const openArchiveReasonDialog = openDialog('archive_feedback_reason');

const archiveFeedback = async (payload, { workspace }) => {
  const { trigger_id: triggerId, action } = payload;
  const { feedbackId } = action.name;
  const { accessToken } = workspace;

  await openArchiveReasonDialog({ feedbackId })({
    accessToken,
    triggerId,
  });
};

module.exports = archiveFeedback;
