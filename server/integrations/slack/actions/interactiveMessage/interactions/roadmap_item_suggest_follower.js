const Promise = require('bluebird');

const { User, RoadmapItem, SlackUser } = require('../../../../../models');
const { postMessage } = require('../../../messages');

const roadmapItemSuggestFollower = async (
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
    name: { roadmapItemId },
  } = action;
  const [user, roadmapItem] = await Promise.all([
    User.findById(userId, {
      include: [{ model: SlackUser, as: 'slackUsers', include: ['workspace'] }],
    }),
    RoadmapItem.findById(roadmapItemId),
  ]);
  const isFollower = await user.hasFollowedRoadmapItem(roadmapItem);
  if (isFollower) {
    const { accessToken } = workspace;
    await postMessage('roadmap_item_already_followed_by')({
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

    await postMessage('roadmap_item_suggest_follow')({ roadmapItem })({
      accessToken,
      channel: userSlackUser.slackId,
    });
  });
};

module.exports = roadmapItemSuggestFollower;
