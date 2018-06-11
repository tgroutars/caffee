const Promise = require('bluebird');

const { Feedback, SlackUser } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const feedbackCreated = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product'],
  });
  const { product } = feedback;

  const usersToNotify = await product.getUsers({
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });
  const postNewFeedback = postMessage('new_feedback')({ feedback, product });

  await Promise.map(usersToNotify, async ({ slackUsers }) => {
    await Promise.map(slackUsers, async slackUser => {
      const { workspace } = slackUser;
      const { accessToken } = workspace;
      await postNewFeedback({ accessToken, channel: slackUser.slackId });
    });
  });
};

module.exports = feedbackCreated;
