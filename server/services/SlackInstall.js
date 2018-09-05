const { trigger } = require('../eventQueue/eventQueue');
const { SlackInstall } = require('../models');

const SlackInstallService = () => ({
  async create({ productId, workspaceId, channel = null }) {
    const slackInstall = await SlackInstall.create({
      productId,
      workspaceId,
      channel,
    });
    await trigger('slack_install_created', { slackInstallId: slackInstall.id });
    return slackInstall;
  },

  async setChannel(slackInstallId, { channel }) {
    await SlackInstall.update({ channel }, { where: { id: slackInstallId } });
  },
});

module.exports = SlackInstallService;
