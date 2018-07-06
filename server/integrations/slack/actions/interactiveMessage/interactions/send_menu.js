const { postEphemeral } = require('../../../messages');
const { ProductUser, Sequelize } = require('../../../../../models');

const { Op } = Sequelize;

const postMenuMessage = postEphemeral('menu');

const sendMenu = async (payload, { workspace, slackUser }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;

  const {
    productId,
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
    defaultFeedback,
    defaultRoadmapItemTitle,
    defaultRoadmapItemDescription,
    defaultAuthorId,
    defaultAuthorName,
    createRoadmapItem: !!productUser,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};

module.exports = sendMenu;
