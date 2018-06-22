const { SlackWorkspace } = require('../../../../../models');

const feedbackAuthorId = async payload => {
  const {
    team: { id: workspaceSlackId },
  } = payload;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['slackUsers'],
  });
  const { slackUsers } = workspace;
  return slackUsers.map(slackUser => ({
    label: slackUser.name,
    value: slackUser.userId,
  }));
};

module.exports = feedbackAuthorId;
