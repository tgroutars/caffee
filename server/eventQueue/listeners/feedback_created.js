const Promise = require('bluebird');

const { Feedback, User, SlackUser } = require('../../models');
const {
  FeedbackExternalRef: FeedbackExternalRefService,
} = require('../../services');
const { postMessage } = require('../../integrations/slack/messages');

const feedbackCreated = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product', 'scope', 'author', 'createdBy', 'assignedTo'],
  });
  const { product, createdBy, author, assignedTo, scope } = feedback;

  const usersTo = await User.findAll({
    where: { id: [createdBy.id, author.id, assignedTo.id] },
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });

  await Promise.map(usersTo, async userTo =>
    Promise.map(userTo.slackUsers, async slackUser => {
      const { workspace } = slackUser;
      const { accessToken } = workspace;
      const { channel, ts } = await postMessage('feedback')({
        feedback,
        product,
        userTo,
        assignedTo,
        createdBy,
        author,
        scope,
      })({ accessToken, channel: slackUser.slackId });
      await FeedbackExternalRefService.create({
        feedbackId,
        ref: `slack:${workspace.slackId}_${channel}_${ts}`,
        props: { ts, channel, userId: userTo.id, workspaceId: workspace.id },
      });
    }),
  );
};

module.exports = feedbackCreated;
