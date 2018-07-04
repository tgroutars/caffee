const Promise = require('bluebird');

const { Feedback } = require('../../../../../models');
const { postEphemeral, updateMessage } = require('../../../messages');
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
    original_message: originalMessage,
  } = payload;

  const { accessToken, appUserId, domain } = workspace;

  const { feedbackId, defaultDescription } = action.name;
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product'],
  });
  const { product } = feedback;
  const { trelloAccessToken, trelloBoardId } = product;

  // TODO: Extract this in some helper
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

  if (feedback.backlogItemId || feedback.archivedAt) {
    await postEphemeral('feedback_already_processed')({ feedback })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    const backlogItem = await feedback.getBacklogItem();
    await updateMessage('new_feedback')({
      feedback,
      backlogItem,
      product,
      backlogItemOptions: { openCard: true },
    })({
      accessToken,
      channel,
      ts: originalMessage.ts,
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
    feedbackMessageRef: { channel, ts: originalMessage.ts },
  })({
    accessToken,
    triggerId,
  });
};

module.exports = openBacklogItemDialog;
