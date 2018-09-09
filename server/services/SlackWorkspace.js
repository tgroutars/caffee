const SlackClient = require('@slack/client').WebClient;
const Promise = require('bluebird');
const winston = require('winston');

const { SlackWorkspace, SlackUser, Sequelize } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');
const { isUser, getUserVals } = require('../integrations/slack/helpers/user');

const { Op } = Sequelize;

const SlackWorkspaceService = services => ({
  async findOrCreate({
    accessToken,
    appId,
    appUserId,
    domain,
    image,
    name,
    slackId,
    refreshToken,
    tokenExpiresAt,
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
        refreshToken,
        tokenExpiresAt,
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

    const slackUsers = await Promise.map(userInfos, async userInfo => {
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
    await SlackUser.destroy({
      where: { id: { [Op.notIn]: slackUsers.map(su => su.id) }, workspaceId },
    });
  },

  async syncAll() {
    const workspaces = await SlackWorkspace.findAll();
    await Promise.map(workspaces, async workspace => {
      try {
        this.syncUsers(workspace.id);
      } catch (err) {
        winston.error(`Couldn't sync Slack workspace ${workspace.domain}`);
        winston.error(err);
      }
    });
  },
});

module.exports = SlackWorkspaceService;
