const Promise = require('bluebird');

const { User, BacklogItem, SlackUser } = require('../../../../../models');
const { postMessage } = require('../../../messages');

const backlogItemSuggestFollower = async (
  payload,
  { slackUser, workspace },
) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
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
  const isFollower = await user.hasFollowedBacklogItem(backlogItem);
  if (isFollower) {
    const { accessToken } = workspace;
    await postMessage('backlog_item_already_followed_by')({
      userName: user.name,
    })({
      accessToken,
      user: slackUser.slackId,
      channel,
    });
    return;
  }
  await Promise.map(user.slackUsers, async userSlackUser => {
    const {
      workspace: { accessToken },
    } = userSlackUser;

    await postMessage('backlog_item_suggest_follow')({ backlogItem })({
      accessToken,
      channel: userSlackUser.slackId,
    });
  });
};

module.exports = backlogItemSuggestFollower;
