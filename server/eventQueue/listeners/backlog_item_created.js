const Promise = require('bluebird');
const winston = require('winston');

const {
  BacklogItem,
  SlackUser,
  SlackInstall,
  User,
  ProductUser,
  Sequelize,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const postNewBacklogItemMessage = postMessage('new_backlog_item');

const backlogItemCreated = async ({ backlogItemId }) => {
  const backlogItem = await BacklogItem.findById(backlogItemId, {
    include: ['product'],
  });
  const { product } = backlogItem;
  const productUsers = await ProductUser.findAll({
    where: { productId: product.id, role: { [Op.in]: ['user', 'admin'] } },
    include: [{ model: User, as: 'user' }],
  });
  const users = productUsers.map(({ user }) => user);
  const postPrivateNewBacklogItemMessage = postNewBacklogItemMessage({
    backlogItem,
    product,
    suggestFollowers: true,
    openCard: true,
  });
  await Promise.map(users, async user => {
    const slackUsers = await SlackUser.findAll({
      where: { userId: user.id },
      include: ['workspace'],
    });
    await Promise.map(slackUsers, async slackUser => {
      const { workspace, slackId } = slackUser;
      const { accessToken } = workspace;
      try {
        await postPrivateNewBacklogItemMessage({
          accessToken,
          channel: slackId,
        });
      } catch (err) {
        winston.error(err);
      }
    });
  });

  const postPublicNewBacklogItemMessage = postNewBacklogItemMessage({
    backlogItem,
    product,
  });
  const slackInstalls = await SlackInstall.findAll({
    where: { productId: product.id, channel: { [Op.ne]: null } },
    include: ['workspace'],
  });

  await Promise.map(slackInstalls, async slackInstall => {
    const { workspace, channel } = slackInstall;
    const { accessToken } = workspace;
    await postPublicNewBacklogItemMessage({ accessToken, channel });
  });
};

module.exports = backlogItemCreated;
