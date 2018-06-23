const Promise = require('bluebird');
const winston = require('winston');

const { getCardURL } = require('../../integrations/trello/helpers/cards');
const {
  BacklogItem,
  SlackUser,
  Product,
  User,
  Sequelize,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const backlogItemCreated = async ({ backlogItemId }) => {
  const backlogItem = await BacklogItem.findById(backlogItemId, {
    include: [
      {
        model: Product,
        as: 'product',
        include: [
          {
            model: User,
            as: 'users',
            through: { where: { role: { [Op.in]: ['user', 'admin'] } } },
            include: [
              { model: SlackUser, as: 'slackUsers', include: ['workspace'] },
            ],
          },
        ],
      },
    ],
  });
  const { product } = backlogItem;
  const { users } = product;

  const postNewBacklogItemMessage = postMessage('new_backlog_item')({
    backlogItem,
    product,
    trelloURL: getCardURL(backlogItem),
  });

  await Promise.map(users, async user => {
    const { slackUsers } = user;
    await Promise.map(slackUsers, async slackUser => {
      const { workspace, slackId } = slackUser;
      const { accessToken } = workspace;
      try {
        await postNewBacklogItemMessage({ accessToken, channel: slackId });
      } catch (err) {
        winston.error(err);
      }
    });
  });
};

module.exports = backlogItemCreated;
