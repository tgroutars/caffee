const Promise = require('bluebird');

const { User, BacklogItem, SlackUser } = require('../../../../../models');
const { postMessage } = require('../../../messages');

const backlogItemSuggestFollower = async payload => {
  const { action } = payload;
  const {
    selected_options: [
      {
        value: { userId },
      },
    ],
    name: { backlogItemId },
  } = action;
  const [user, backlogItem] = await Promise.all([
    User.findById(userId, {
      include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
    }),
    BacklogItem.findById(backlogItemId),
  ]);
  await Promise.map(user.slackUsers, async slackUser => {
    const { workspace, slackId: userSlackId } = slackUser;
    const { accessToken } = workspace;
    await postMessage('backlog_item_suggest_follow')({ backlogItem })({
      accessToken,
      channel: userSlackId,
    });
  });
};

module.exports = backlogItemSuggestFollower;
