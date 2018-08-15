const {
  Product,
  ProductUser,
  Scope,
  Sequelize,
} = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

const { Op } = Sequelize;

const openFeedbackDialogHelper = openDialog('feedback');

module.exports = async (payload, { slackUser, workspace }) => {
  const {
    action: {
      name: actionName,
      selected_options: [selectedOption],
    },
    channel: { id: channel },
    trigger_id: triggerId,
  } = payload;
  const {
    productId,
    files,
    defaultAuthorId,
    defaultAuthorName,
    defaultFeedback,
    defaultScopeId,
    level,
  } = actionName;
  const { accessToken } = workspace;
  const product = await Product.findById(productId);

  if (selectedOption.value === 'default') {
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
      scopeId: defaultScopeId,
    })({
      accessToken,
      triggerId,
    });
  }

  const scopeId = selectedOption.value;
  const scopes = await Scope.findAll({ where: { parentId: scopeId } });

  if (scopes.length) {
    await postEphemeral('feedback_choose_scope')({
      productId,
      files,
      defaultFeedback,
      defaultAuthorId,
      defaultAuthorName,
      scopes,
      level: level + 1,
      defaultScopeId: scopeId,
    })({ accessToken, channel, user: slackUser.slackId });
  }
};
