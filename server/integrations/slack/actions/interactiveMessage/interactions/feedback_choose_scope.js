const { Product, ProductUser, Scope } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');

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

  const defaultSelected = selectedOption.value === 'default';
  const selectedScopeId = defaultSelected
    ? defaultScopeId
    : selectedOption.value;

  if (!defaultSelected) {
    const scopes = await Scope.findAll({
      where: { parentId: selectedScopeId, archivedAt: null },
    });

    if (scopes.length) {
      await postEphemeral('feedback_choose_scope')({
        productId,
        files,
        defaultFeedback,
        defaultAuthorId,
        defaultAuthorName,
        scopes,
        level: level + 1,
        defaultScopeId: selectedScopeId,
      })({ accessToken, channel, user: slackUser.slackId });
      return;
    }
  }

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId,
    },
    include: ['product'],
  });

  await openFeedbackDialogHelper({
    files,
    product,
    defaultFeedback,
    defaultAuthorId,
    defaultAuthorName,
    selectAuthor: productUser.isPM,
    scopeId: selectedScopeId,
  })({
    accessToken,
    triggerId,
  });
};
