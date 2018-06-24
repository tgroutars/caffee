const Promise = require('bluebird');

const { Feedback, User, SlackUser } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const feedbackArchived = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      {
        model: User,
        as: 'author',
        include: [
          { model: SlackUser, as: 'slackUsers', include: ['workspace'] },
        ],
      },
    ],
  });
  const { author } = feedback;
  const { slackUsers } = author;
  const postFeedbackArchivedMessage = postMessage('feedback_archived')({
    feedback,
  });

  await Promise.map(slackUsers, async slackUser => {
    const { workspace, slackId: userSlackId } = slackUser;
    const { accessToken } = workspace;
    await postFeedbackArchivedMessage({ accessToken, channel: userSlackId });
  });
};

module.exports = feedbackArchived;
