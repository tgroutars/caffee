const SlackClient = require('@slack/client').WebClient;
const Promise = require('bluebird');

const { SlackWorkspace } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');
const { isUser, getUserVals } = require('../integrations/slack/helpers/user');

const SlackWorkspaceService = services => ({
  async findOrCreate({
    accessToken,
    appId,
    appUserId,
    domain,
    image,
    name,
    slackId,
  }) {
    const [workspace, created] = await SlackWorkspace.findOrCreate({
      where: { slackId },
      defaults: {
        accessToken,
        name,
        domain,
        image,
        appId,
        appUserId,
      },
    });
    if (created) {
      trigger('slack_workspace_created', { workspaceId: workspace.id });
    }
    return [workspace, created];
  },

  async syncUsers(workspaceId) {
    const workspace = await SlackWorkspace.findById(workspaceId);
    const { accessToken } = workspace;
    const slackClient = new SlackClient(accessToken);
    const usersList = await slackClient.users.list();
    const userInfos = usersList.members.filter(userInfo => isUser(userInfo));

    return Promise.map(userInfos, async userInfo => {
      const { email, name, image, slackId } = getUserVals(userInfo);
      const [slackUser] = await services.SlackUser.findOrCreate({
        email,
        image,
        name,
        slackId,
        workspaceId: workspace.id,
      });
      return slackUser;
    });
  },
});

module.exports = SlackWorkspaceService;
