const Promise = require('bluebird');

const { Feedback } = require('../../../../../models');
const { postEphemeral, updateMessage } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { openDialog } = require('../../../dialogs');
const { listBoards } = require('../../../../trello/helpers/api');

const openRoadmapItemDialogHelper = openDialog('roadmap_item');
const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const openRoadmapItemDialog = async (payload, { workspace, slackUser }) => {
  const {
    action,
    trigger_id: triggerId,
    channel: { id: channel },
    original_message: originalMessage,
  } = payload;

  const { accessToken, appUserId, domain } = workspace;

  const { feedbackId, defaultDescription } = action.name;
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product', 'author'],
  });
  const { product, author } = feedback;
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

  if (feedback.roadmapItemId || feedback.archivedAt) {
    await postEphemeral('feedback_already_processed')({ feedback })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    const roadmapItem = await feedback.getRoadmapItem();
    await updateMessage('new_feedback')({
      feedback,
      roadmapItem,
      product,
      author,
      roadmapItemOptions: { openCard: true },
    })({
      accessToken,
      channel,
      ts: originalMessage.ts,
    });
    return;
  }
  const [tags, roadmapStages] = await Promise.all([
    product.getTags(),
    product.getRoadmapStages({ order: [['position', 'asc']] }),
  ]);

  await openRoadmapItemDialogHelper({
    tags,
    feedbackId,
    roadmapStages,
    productId: product.id,
    defaultDescription,
    feedbackMessageRef: { channel, ts: originalMessage.ts },
  })({
    accessToken,
    triggerId,
  });
};

module.exports = openRoadmapItemDialog;
