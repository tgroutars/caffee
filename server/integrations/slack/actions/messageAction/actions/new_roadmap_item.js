const Promise = require('bluebird');

const getTitleDescription = require('../../../../../lib/getTitleDescription');
const { Sequelize } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { listBoards } = require('../../../../trello/helpers/api');
const { SlackPermissionError } = require('../../../../../lib/errors');

const { Op } = Sequelize;

const openRoadmapItemDialog = openDialog('roadmap_item');
const postChooseProductMessage = postEphemeral('roadmap_item_choose_product');
const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const newRoadmapItem = async (payload, { workspace, slackUser, user }) => {
  const {
    team: { domain },
    channel: { id: channel },
    message: { text, files },
    trigger_id: triggerId,
  } = payload;
  const { accessToken } = workspace;
  const { title, description } = getTitleDescription(text);

  const products = await user.getProducts({
    through: { where: { role: { [Op.in]: ['user', 'admin'] } } },
  });

  if (!products.length) {
    throw new SlackPermissionError();
  }

  if (products.length > 1) {
    await postChooseProductMessage({
      files,
      products,
      defaultTitle: title,
      defaultDescription: description,
    })({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
    return;
  }
  const [product] = products;

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
    product.getRoadmapStages({ where: { isArchived: false } }),
    product.getTags(),
  ]);
  await openRoadmapItemDialog({
    tags,
    files,
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
