const { postEphemeral } = require('../../../messages');
const { ProductUser, Sequelize } = require('../../../../../models');
const { passwordlessURL } = require('../../../../../lib/auth');

const { Op } = Sequelize;

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
      role: { [Op.in]: ['user', 'admin'] },
    },
  });

  await postMenuMessage({
    productId,
    files,
    defaultFeedback,
    defaultRoadmapItemTitle,
    defaultRoadmapItemDescription,
    defaultAuthorId,
    defaultAuthorName,
    settingsURL: productUser.isAdmin
      ? await passwordlessURL(user.id, { path: `/p/${productId}/settings` })
      : null,
    createRoadmapItem: !!productUser,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};

module.exports = sendMenu;
