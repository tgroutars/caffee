const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');
const { Feedback } = require('../../../../../models');

const openArchiveReasonDialog = openDialog('archive_feedback');

const archiveFeedback = async (payload, { workspace, slackUser }) => {
  const {
    trigger_id: triggerId,
    action,
    channel: { id: channel },
  } = payload;
  const { feedbackId } = action.name;
  const { accessToken } = workspace;

  const feedback = await Feedback.findById(feedbackId, {
    include: ['product', 'author'],
  });

  if (feedback.roadmapItemId || feedback.archivedAt) {
    await postEphemeral('feedback_already_processed')({ feedback })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  } else {
    await openArchiveReasonDialog({
      feedbackId,
    })({
      accessToken,
      triggerId,
    });
  }
};

module.exports = archiveFeedback;
