const Promise = require('bluebird');

const {
  Feedback,
  SlackWorkspace,
  SlackUser,
} = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { openDialog } = require('../../../dialogs');
const { listBoards } = require('../../../../trello/helpers/api');

const openBacklogItemDialogHelper = openDialog('backlog_item');
const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const openBacklogItemDialog = async payload => {
  const {
    action,
    trigger_id: triggerId,
    team: { id: workspaceSlackId },
    channel: { id: channel },
    user: { id: userSlackId },
  } = payload;

  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const { accessToken, appUserId, domain } = workspace;

  const { feedbackId } = action.name;
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product'],
  });
  const { product } = feedback;
  const { trelloAccessToken, trelloBoardId } = product;

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId, workspaceId: workspace.id },
  });

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
      user: userSlackId,
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
      user: userSlackId,
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
    defaultDescription: feedback.description,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = openBacklogItemDialog;
