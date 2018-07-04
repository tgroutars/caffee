const uniqBy = require('lodash/uniqBy');

const {
  Product,
  SlackWorkspace,
  ProductUser,
  Sequelize,
} = require('../../../models');
const { postEphemeral } = require('../messages');
const getTitleDescription = require('../../../lib/getTitleDescription');

const { Op } = Sequelize;

const postChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const caffee = async ({ workspaceSlackId, channel, userSlackId, text }) => {
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
    include: ['installs'],
  });
  if (!workspace) {
    return;
  }
  const { accessToken } = workspace;

  const installs = uniqBy(workspace.installs, ({ productId }) => productId);

  if (!installs.length) {
    return;
  }

  const { title, description } = getTitleDescription(text);

  const [slackUser] = await workspace.getSlackUsers({
    where: { slackId: userSlackId },
  });
  if (installs.length > 1) {
    const products = await Product.findAll({
      where: {
        id: installs.map(({ productId }) => productId),
      },
    });

    await postChooseProductMessage({
      products,
      defaulFeedback: text,
      defaultBacklogItemTitle: title,
      defaultBacklogItemDescription: description,
      defaultAuthorId: slackUser.userId,
    })({ accessToken, channel, user: userSlackId });
    return;
  }

  const install = installs[0];
  const { productId } = install;

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId,
      role: { [Op.in]: ['user', 'admin'] },
    },
  });

  await postMenuMessage({
    productId,
    defaulFeedback: text,
    defaultBacklogItemTitle: title,
    defaultBacklogItemDescription: description,
    defaultAuthorId: slackUser.userId,
    createBacklogItem: !!productUser,
  })({
    accessToken,
    channel,
    user: userSlackId,
  });
};

module.exports = caffee;
