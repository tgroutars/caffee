const Promise = require('bluebird');

const { Feedback, User, SlackUser } = require('../../models');
const {
  FeedbackExternalRef: FeedbackExternalRefService,
} = require('../../services');
const { postMessage } = require('../../integrations/slack/messages');

const feedbackCreated = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product'],
  });
  const { product, createdById, authorId, assignedToId } = feedback;
  const [assignedTo, author, createdBy] = await Promise.all([
    User.findById(assignedToId),
    User.findById(authorId),
    User.findById(createdById),
  ]);
  const usersTo = await User.findAll({
    where: { id: [createdById, authorId, assignedToId] },
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });

  await Promise.map(usersTo, async userTo =>
    Promise.map(userTo.slackUsers, async slackUser => {
      const { workspace } = slackUser;
      const { accessToken } = workspace;
      const { channel, ts } = await postMessage('new_feedback')({
        feedback,
        product,
        userTo,
        assignedTo,
        createdBy,
        author,
      })({ accessToken, channel: slackUser.slackId });
      await FeedbackExternalRefService.create({
        feedbackId,
        ref: `slack:${workspace.id}-${channel}-${ts}`,
        props: { ts, channel, userId: userTo.id, workspaceId: workspace.id },
      });
    }),
  );
};

module.exports = feedbackCreated;
