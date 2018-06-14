const { Feedback, SlackWorkspace } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');

const postInstallTrelloMessage = postEphemeral('install_trello');

const openBacklogItemDialog = async payload => {
  const {
    team: { id: workspaceSlackId },
    action,
    channel: { id: channel },
    user: { id: user },
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

  if (!product.trelloAccessToken) {
    const returnTo = `https://${domain}.slack.com/app_redirect?channel=${appUserId}`;
    const installURL = await getInstallURL(product.id, { returnTo });
    await postInstallTrelloMessage({ installURL })({
      accessToken,
      channel,
      user,
    });
  }

  // TODO: handle set board
  // TODO: handle create backlog item
};

module.exports = openBacklogItemDialog;
