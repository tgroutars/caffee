const Promise = require('bluebird');

const { Feedback, SlackWorkspace, User } = require('../../models');
const { updateMessage } = require('../../integrations/slack/messages');

module.exports = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      'externalRefs',
      'author',
      'createdBy',
      'assignedTo',
      'product',
      'roadmapItem',
    ],
  });
  const {
    product,
    roadmapItem,
    author,
    createdBy,
    assignedTo,
    externalRefs,
  } = feedback;
  await Promise.map(externalRefs, async externalRef => {
    const { userId, workspaceId, channel, ts } = externalRef.props;
    const [workspace, userTo] = await Promise.all([
      SlackWorkspace.findById(workspaceId),
      User.findById(userId),
    ]);
    const { accessToken } = workspace;
    await updateMessage('feedback')({
      userTo,
      feedback,
      product,
      roadmapItem,
      author,
      createdBy,
      assignedTo,
    })({ accessToken, channel, ts });
  });
};
//
// userTo,
