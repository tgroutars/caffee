const Promise = require('bluebird');

const { postEphemeral } = require('../../../messages');
const { BacklogItem, SlackWorkspace } = require('../../../../../models');

module.exports = async payload => {
  const {
    team: { id: workspaceSlackId },
    user: { id: userSlackId },
    channel: { id: channel },
    action,
  } = payload;

  const { backlogItemId } = action.name;
  const [backlogItem, workspace] = await Promise.all([
    BacklogItem.findById(backlogItemId),
    SlackWorkspace.find({
      where: { slackId: workspaceSlackId },
    }),
  ]);
  const { accessToken } = workspace;
  await postEphemeral('backlog_item_expanded')({ backlogItem })({
    accessToken,
    channel,
    user: userSlackId,
  });
};
