const Promise = require('bluebird');

const getTitleDescription = require('../../../../../lib/getTitleDescription');
const { ProductUser, Sequelize } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { listBoards } = require('../../../../trello/helpers/api');

const { Op } = Sequelize;

const openRoadmapItemDialog = openDialog('roadmap_item');
const postChooseProductMessage = postEphemeral('roadmap_item_choose_product');
const postForbiddenMessage = postEphemeral('forbidden');
const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const newRoadmapItem = async (payload, { workspace, slackUser }) => {
  const {
    team: { domain },
    channel: { id: channel },
    message: { text },
    trigger_id: triggerId,
  } = payload;

  const [products, adminProducts] = await Promise.all([
    workspace.getProducts(),
    workspace.getProducts({
      include: [
        {
          model: ProductUser,
          as: 'productUsers',
          where: {
            userId: slackUser.userId,
            role: { [Op.in]: ['user', 'admin'] },
          },
        },
      ],
    }),
  ]);

  if (!products.length) {
    return;
  }

  const { accessToken } = workspace;

  const { title, description } = getTitleDescription(text);

  if (!adminProducts.length) {
    await postForbiddenMessage()({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    return;
  }

  if (products.length > 1) {
    await postChooseProductMessage({
      products: adminProducts,
      defaultTitle: title,
      defaultDescription: description,
    })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    return;
  }
  const product = adminProducts[0];

  if (!product.trelloAccessToken) {
    const returnTo = `https://${domain}.slack.com/app_redirect?channel=${
      workspace.appUserId
    }`;
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
  if (!product.trelloBoardId) {
    const boards = await listBoards(product.trelloAccessToken);
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

  const [roadmapStages, tags] = await Promise.all([
    product.getRoadmapStages(),
    product.getTags(),
  ]);
  await openRoadmapItemDialog({
    tags,
    roadmapStages,
    productId: product.id,
    defaultTitle: title,
    defaultDescription: description,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = newRoadmapItem;
