const uniqBy = require('lodash/uniqBy');

const { Product, SlackWorkspace, ProductUser } = require('../../../models');
const { postEphemeral } = require('../messages');
const getTitleDescription = require('../../../lib/getTitleDescription');
const { decode } = require('../helpers/encoding');
const { getPasswordLessURL } = require('../../../lib/auth');
const { productSettings } = require('../../../lib/clientRoutes');

const postChooseProductMessage = postEphemeral('menu_choose_product');
const postMenuMessage = postEphemeral('menu');

const caffee = async ({
  workspaceSlackId,
  channel,
  userSlackId,
  text: rawText,
}) => {
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

  const text = await decode(workspace)(rawText);

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
      defaultRoadmapItemTitle: title,
      defaultRoadmapItemDescription: description,
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
    },
  });

  await postMenuMessage({
    productId,
    defaultFeedback: text,
    defaultRoadmapItemTitle: title,
    defaultRoadmapItemDescription: description,
    defaultAuthorId: slackUser.userId,
    createRoadmapItem: productUser.isPM,
    settingsURL: productUser.isAdmin
      ? await getPasswordLessURL(slackUser.userId, {
          path: productSettings(productId),
        })
      : null,
  })({
    accessToken,
    channel,
    user: userSlackId,
  });
};

module.exports = caffee;
