const Promise = require('bluebird');

const { Feedback, User, SlackUser } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const feedbackProcessed = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      'backlogItem',
      {
        model: User,
        as: 'author',
        include: [
          { model: SlackUser, as: 'slackUsers', include: ['workspace'] },
        ],
      },
    ],
  });
  const { backlogItem, author } = feedback;
  const { slackUsers } = author;
  const postFeedbackProcessedMessage = postMessage('feedback_processed')({
    feedback,
    backlogItem,
  });

  await Promise.map(slackUsers, async slackUser => {
    const { workspace, slackId: userSlackId } = slackUser;
    const { accessToken } = workspace;
    await postFeedbackProcessedMessage({ accessToken, channel: userSlackId });
  });
};

module.exports = feedbackProcessed;
