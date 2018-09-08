const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');
const { Feedback, ProductUser } = require('../../../../../models');
const { SlackPermissionError } = require('../../../../../lib/errors');

const openArchiveReasonDialog = openDialog('archive_feedback');

const archiveFeedback = async (payload, { workspace, slackUser, user }) => {
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

  const productUser = await ProductUser.find({
    where: { productId: feedback.productId, userId: user.id },
  });
  if (!productUser || !productUser.isPM) {
    throw new SlackPermissionError();
  }

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
