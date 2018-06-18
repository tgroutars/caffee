const Promise = require('bluebird');

const { getCardURL } = require('../../integrations/trello/helpers/cards');
const { BacklogItem, SlackUser } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const backlogItemCreated = async ({ backlogItemId }) => {
  const backlogItem = await BacklogItem.findById(backlogItemId, {
    include: ['product'],
  });
  const { product } = backlogItem;
  const users = await product.getUsers({
    include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
  });

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
      await postNewBacklogItemMessage({ accessToken, channel: slackId });
    });
  });
};

module.exports = backlogItemCreated;
