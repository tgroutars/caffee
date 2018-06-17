const {
  Feedback,
  SlackWorkspace,
  SlackUser,
} = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { openDialog } = require('../../../dialogs');
const { listBoards, listLists } = require('../../../../trello/helpers/api');

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

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId, workspaceId: workspace.id },
  });

  if (!product.trelloAccessToken) {
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

  if (!product.trelloBoardId) {
    const boards = await listBoards(product.trelloAccessToken);
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

  const lists = await listLists(product.trelloAccessToken, {
    boardId: product.trelloBoardId,
  });
  await openBacklogItemDialogHelper({
    lists,
    feedbackId,
    productId: product.id,
    defaultDescription: feedback.description,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = openBacklogItemDialog;
