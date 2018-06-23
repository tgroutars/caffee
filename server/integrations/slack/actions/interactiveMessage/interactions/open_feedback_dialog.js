const {
  SlackWorkspace,
  ProductUser,
  SlackUser,
  Sequelize,
} = require('../../../../../models');
const { openDialog } = require('../../../dialogs');

const { Op } = Sequelize;

const openFeedbackDialogHelper = openDialog('feedback');

const openFeedbackDialog = async payload => {
  const {
    team: { id: workspaceSlackId },
    user: { id: userSlackId },
    trigger_id: triggerId,
    action,
  } = payload;

  const {
    productId,
    defaultFeedback,
    defaultAuthorName,
    defaultAuthorId,
  } = action.name;

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId },
    include: [
      {
        model: SlackWorkspace,
        as: 'workspace',
        where: { slackId: workspaceSlackId },
      },
    ],
  });
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const { accessToken } = workspace;

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId,
      role: { [Op.in]: ['user', 'admin'] },
    },
  });
  await openFeedbackDialogHelper({
    productId,
    defaultFeedback,
    defaultAuthorId,
    defaultAuthorName,
    selectAuthor: !!productUser,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = openFeedbackDialog;
