const { postEphemeral } = require('../../../messages');
const { BacklogItem } = require('../../../../../models');

module.exports = async (payload, { workspace, slackUser }) => {
  const {
    channel: { id: channel },
    action,
  } = payload;

  const { backlogItemId } = action.name;
  const backlogItem = await BacklogItem.findById(backlogItemId, {
    include: ['followers', 'stage'],
  });

  const { followers, stage } = backlogItem;
  const { accessToken } = workspace;
  await postEphemeral('backlog_item_expanded')({
    backlogItem,
    followers,
    stage,
  })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};
