const Promise = require('bluebird');

const {
  SlackWorkspace,
  SlackUser,
  ProductUser,
  Sequelize,
} = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { postEphemeral } = require('../../../messages');
const { getInstallURL } = require('../../../../trello/helpers/auth');
const { listBoards } = require('../../../../trello/helpers/api');

const { Op } = Sequelize;

const openBacklogItemDialog = openDialog('backlog_item');
const postChooseProductMessage = postEphemeral('backlog_item_choose_product');
const postForbiddenMessage = postEphemeral('forbidden');
const postInstallTrelloMessage = postEphemeral('install_trello');
const postChooseBoardMessage = postEphemeral('choose_board');

const newBacklogItem = async payload => {
  const {
    team: { id: workspaceSlackId, domain },
    user: { id: userSlackId },
    channel: { id: channel },
    message: { text },
    trigger_id: triggerId,
  } = payload;

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId },
    include: [
      'user',
      {
        model: SlackWorkspace,
        as: 'workspace',
        where: { slackId: workspaceSlackId },
      },
    ],
  });
  const { workspace, user } = slackUser;

  const [products, adminProducts] = await Promise.all([
    workspace.getProducts(),
    workspace.getProducts({
      include: [
        {
          model: ProductUser,
          as: 'productUsers',
          where: { userId: user.id, role: { [Op.in]: ['user', 'admin'] } },
        },
      ],
    }),
  ]);

  if (!products.length) {
    return;
  }

  const { accessToken } = workspace;

  if (!adminProducts.length) {
    await postForbiddenMessage()({ accessToken, channel, user: userSlackId });
    return;
  }

  if (products.length > 1) {
    await postChooseProductMessage({
      products: adminProducts,
      defaultDescription: text,
    })({
      accessToken,
      channel,
      user: userSlackId,
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
      user: userSlackId,
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
      user: userSlackId,
    });
    return;
  }

  const [backlogStages, tags] = await Promise.all([
    product.getBacklogStages(),
    product.getTags(),
  ]);
  await openBacklogItemDialog({
    tags,
    backlogStages,
    productId: product.id,
    defaultDescription: text,
  })({
    accessToken,
    triggerId,
  });
};

module.exports = newBacklogItem;
