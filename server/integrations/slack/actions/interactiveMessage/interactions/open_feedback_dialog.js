const {
  ProductUser,
  Product,
  Scope,
  Sequelize,
} = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

const { Op } = Sequelize;

const openFeedbackDialogHelper = openDialog('feedback');

const openFeedbackDialog = async (payload, { workspace, slackUser }) => {
  const {
    action,
    trigger_id: triggerId,
    channel: { id: channel },
  } = payload;
  const {
    files,
    productId,
    defaultFeedback,
    defaultAuthorName,
    defaultAuthorId,
  } = action.name;
  const { accessToken } = workspace;
  const product = await Product.findById(productId);
  const scopes = await Scope.findAll({
    where: { productId, parentId: null, archivedAt: null },
  });

  if (scopes.length) {
    await postEphemeral('feedback_choose_scope')({
      productId,
      files,
      defaultFeedback,
      defaultAuthorId,
      defaultAuthorName,
      scopes,
    })({ accessToken, channel, user: slackUser.slackId });
    return;
  }

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId,
      role: { [Op.in]: ['user', 'admin'] },
    },
    include: ['product'],
  });

  await openFeedbackDialogHelper({
    files,
    product,
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
