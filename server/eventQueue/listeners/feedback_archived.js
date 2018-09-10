const Promise = require('bluebird');

const { Feedback, User, SlackUser, SlackWorkspace } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const feedbackArchived = async ({ feedbackId, archivedById }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      {
        model: User,
        as: 'author',
        include: [
          { model: SlackUser, as: 'slackUsers', include: ['workspace'] },
        ],
      },
      'externalRefs',
    ],
  });
  const archivedBy = await User.findById(archivedById);
  const { externalRefs } = feedback;

  const postFeedbackArchivedMessage = postMessage('feedback_archived')({
    feedback,
    archivedBy,
  });

  await Promise.map(externalRefs, async externalRef => {
    const { channel, ts, workspaceId } = externalRef.props;
    const workspace = await SlackWorkspace.findById(workspaceId);
    const { accessToken } = workspace;
    await postFeedbackArchivedMessage({
      accessToken,
      channel,
      threadTS: ts,
      replyBroadcast: true,
    });
  });
};

module.exports = feedbackArchived;
