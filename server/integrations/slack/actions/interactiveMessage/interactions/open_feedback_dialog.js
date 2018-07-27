const { ProductUser, Sequelize } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');

const { Op } = Sequelize;

const openFeedbackDialogHelper = openDialog('feedback');

const openFeedbackDialog = async (payload, { workspace, slackUser }) => {
  const { trigger_id: triggerId, action } = payload;

  const {
    files,
    productId,
    defaultFeedback,
    defaultAuthorName,
    defaultAuthorId,
  } = action.name;

  const { accessToken } = workspace;

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId,
      role: { [Op.in]: ['user', 'admin'] },
    },
  });
  await openFeedbackDialogHelper({
    files,
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
