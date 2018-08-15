const Promise = require('bluebird');

const { Feedback, User, SlackUser } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const feedbackCreated = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product', 'author'],
  });
  const { product, createdById, author, assignedToId } = feedback;

  const postNewFeedback = postMessage('new_feedback')({
    feedback,
    product,
    author,
  });
  const responsible = await User.findById(assignedToId, {
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });
  await Promise.map(responsible.slackUsers, async slackUser => {
    const { workspace } = slackUser;
    const { accessToken } = workspace;
    await postNewFeedback({ accessToken, channel: slackUser.slackId });
  });

  if (author.id !== createdById) {
    const [authorSlackUsers, createdBy] = await Promise.all([
      author.getSlackUsers({ include: ['workspace'] }),
      User.findById(createdById),
    ]);
    await Promise.map(authorSlackUsers, async slackUser => {
      const { workspace } = slackUser;
      const { accessToken } = workspace;
      await postMessage('feedback_created_by')({ createdBy, feedback })({
        accessToken,
        channel: slackUser.slackId,
      });
    });
  }
};

module.exports = feedbackCreated;
