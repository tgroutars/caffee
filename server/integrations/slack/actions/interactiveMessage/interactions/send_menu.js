const { postEphemeral } = require('../../../messages');
const { ProductUser } = require('../../../../../models');
const { getPasswordLessURL } = require('../../../../../lib/auth');
const { productSettings } = require('../../../../../lib/clientRoutes');
const { SlackPermissionError } = require('../../../../../lib/errors');

const postMenuMessage = postEphemeral('menu');

const sendMenu = async (payload, { workspace, slackUser, user }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;

  const {
    productId,
    files,
    defaultFeedback,
    defaultRoadmapItemTitle,
    defaultRoadmapItemDescription,
    defaultAuthorId,
    defaultAuthorName,
  } = action.name;

  const { accessToken } = workspace;

  const productUser = await ProductUser.find({
    where: {
      userId: slackUser.userId,
      productId,
    },
  });
  if (!productUser) {
    throw new SlackPermissionError();
  }

  await postMenuMessage({
    productId,
    files,
    defaultFeedback,
    defaultRoadmapItemTitle,
    defaultRoadmapItemDescription,
    defaultAuthorId,
    defaultAuthorName,
    settingsURL: productUser.isAdmin
      ? await getPasswordLessURL(user.id, { path: productSettings(productId) })
      : null,
    createRoadmapItem: productUser.isPM,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};

module.exports = sendMenu;
