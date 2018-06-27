const { openDialog } = require('../../../dialogs');
const { postEphemeral, updateMessage } = require('../../../messages');
const { Feedback } = require('../../../../../models');

const openArchiveReasonDialog = openDialog('archive_feedback_reason');

const archiveFeedback = async (payload, { workspace, slackUser }) => {
  const {
    trigger_id: triggerId,
    action,
    channel: { id: channel },
    original_message: originalMessage,
  } = payload;
  const { feedbackId } = action.name;
  const { accessToken } = workspace;

  const feedback = await Feedback.findById(feedbackId, {
    include: ['product', 'backlogItem'],
  });

  if (feedback.backlogItemId || feedback.archivedAt) {
    await postEphemeral('feedback_already_processed')({ feedback })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    const { backlogItem, product } = feedback;
    await updateMessage('new_feedback')({
      feedback,
      backlogItem,
      product,
      backlogItemOptions: { openCard: true },
    })({
      accessToken,
      channel,
      ts: originalMessage.ts,
    });
  } else {
    await openArchiveReasonDialog({
      feedbackId,
      feedbackMessageRef: { channel, ts: originalMessage.ts },
    })({
      accessToken,
      triggerId,
    });
  }
};

module.exports = archiveFeedback;
