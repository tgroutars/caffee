const uniqBy = require('lodash/uniqBy');

const { Product, SlackWorkspace } = require('../../../models');
const { openDialog } = require('../dialogs');
const { postEphemeral } = require('../messages');

const openFeedbackDialog = openDialog('feedback');
const postChooseProductMessage = postEphemeral('feedback_choose_product');

const caffee = async ({
  workspaceSlackId,
  triggerId,
  channel,
  userSlackId,
  text,
}) => {
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['installs'],
  });
  const { accessToken } = workspace;

  const installs = uniqBy(workspace.installs, ({ productId }) => productId);

  if (!installs.length) {
    return;
  }

  if (installs.length > 1) {
    const products = await Product.findAll({
      where: {
        id: installs.map(({ productId }) => productId),
      },
    });
    await postChooseProductMessage({ products, defaultFeedback: text })({
      accessToken,
      channel,
      user: userSlackId,
    });
    return;
  }

  const install = installs[0];
  const { productId } = install;
  await openFeedbackDialog({ productId, defaultFeedback: text })({
    accessToken,
    triggerId,
  });
};

module.exports = caffee;
