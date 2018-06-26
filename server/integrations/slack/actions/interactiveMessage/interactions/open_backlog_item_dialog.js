const Promise = require('bluebird');

const { Feedback, Product } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { openDialog } = require('../../../dialogs');
const { listBoards } = require('../../../../trello/helpers/api');

const openBacklogItemDialogHelper = openDialog('backlog_item');
const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const openBacklogItemDialog = async (payload, { workspace, slackUser }) => {
  const {
    action,
    trigger_id: triggerId,
    channel: { id: channel },
  } = payload;

  const { accessToken, appUserId, domain } = workspace;

  let feedback;
  let product;
  const { feedbackId, productId, defaultDescription } = action.name;
  if (feedbackId) {
    feedback = await Feedback.findById(feedbackId, {
      include: ['product'],
    });
    ({ product } = feedback);
  } else {
    product = await Product.findById(productId);
  }

  const { trelloAccessToken, trelloBoardId } = product;

  if (!trelloAccessToken) {
    const returnTo = `https://${domain}.slack.com/app_redirect?channel=${appUserId}`;
    const installURL = await getInstallURL(product.id, {
      returnTo,
      userId: slackUser.userId,
      workspaceId: workspace.id,
    });
    await postInstallTrelloMessage({ installURL })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    return;
  }

  // TODO: load boards from external url
  // => cleaner
  // => Respond faster
  // => Can include more boards if too many
  if (!trelloBoardId) {
    const boards = await listBoards(trelloAccessToken);
    await postChooseBoardMessage({
      product,
      boards,
    })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    return;
  }

  const [tags, backlogStages] = await Promise.all([
    product.getTags(),
    product.getBacklogStages({ order: [['position', 'asc']] }),
  ]);

  await openBacklogItemDialogHelper({
    tags,
    feedbackId,
    backlogStages,
    productId: product.id,
    defaultDescription,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = openBacklogItemDialog;
