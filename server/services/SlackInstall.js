const Promise = require('bluebird');
const SlackClient = require('@slack/client').WebClient;

const { isUser, getUserVals } = require('../integrations/slack/helpers/user');
const { trigger } = require('../eventQueue/eventQueue');
const { SlackInstall } = require('../models');

const SlackInstallService = services => ({
  async create({ productId, workspaceId, channel = null }) {
    const slackInstall = await SlackInstall.create({
      productId,
      workspaceId,
      channel,
    });
    await trigger('slack_install_created', { slackInstallId: slackInstall.id });
    return slackInstall;
  },

  async syncUsers(slackInstallId) {
    const slackInstall = await SlackInstall.findById(slackInstallId, {
      include: ['workspace'],
    });
    const { workspace, productId } = slackInstall;
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
      await slackUser.user.addProduct(productId);
      return slackUser;
    });
    return slackUsers;
  },
});

module.exports = SlackInstallService;
