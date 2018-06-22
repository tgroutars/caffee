const {
  SlackWorkspace,
  SlackUser,
  Sequelize,
} = require('../../../../../models');

const { Op } = Sequelize;

const feedbackAuthorId = async payload => {
  const {
    team: { id: workspaceSlackId },
    value,
  } = payload;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: [
      {
        model: SlackUser,
        as: 'slackUsers',
        where: { name: { [Op.iLike]: `%${value.replace('%', '\\%')}%` } },
      },
    ],
  });
  const { slackUsers } = workspace;
  return slackUsers.map(slackUser => ({
    label: slackUser.name,
    value: slackUser.userId,
  }));
};

module.exports = feedbackAuthorId;
