const Promise = require('bluebird');

const { Product, ProductUser } = require('../../../../../models');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { openDialog } = require('../../../dialogs');
const { listBoards } = require('../../../../trello/helpers/api');
const { SlackPermissionError } = require('../../../../../lib/errors');

const openRoadmapItemDialogHelper = openDialog('roadmap_item');
const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const openRoadmapItemDialog = async (
  payload,
  { workspace, slackUser, user },
) => {
  const {
    action,
    trigger_id: triggerId,
    channel: { id: channel },
  } = payload;

  const { accessToken, appUserId, domain } = workspace;

  const { productId, files, defaultTitle, defaultDescription } = action.name;

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser || !productUser.isPM) {
    throw new SlackPermissionError();
  }

  const product = await Product.findById(productId);

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

  const [tags, roadmapStages] = await Promise.all([
    product.getTags(),
    product.getRoadmapStages({
      order: [['position', 'asc']],
      where: { isArchived: false },
    }),
  ]);

  await openRoadmapItemDialogHelper({
    tags,
    roadmapStages,
    productId: product.id,
    files,
    defaultTitle,
    defaultDescription,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = openRoadmapItemDialog;
