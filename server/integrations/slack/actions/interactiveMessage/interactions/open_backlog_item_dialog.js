const {
  Feedback,
  SlackWorkspace,
  SlackUser,
} = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { listBoards } = require('../../../../trello/helpers/api');

const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const openBacklogItemDialog = async payload => {
  const {
    team: { id: workspaceSlackId },
    action,
    channel: { id: channel },
    user: { id: userSlackId },
  } = payload;

  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const { accessToken, appUserId, domain } = workspace;

  const { feedbackId } = action.value;
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
};

module.exports = openBacklogItemDialog;
