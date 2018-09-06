const { SlackInstall } = require('../models');

const SlackInstallService = () => ({
  async create({ productId, workspaceId, channel = null }) {
    return SlackInstall.create({
      productId,
      workspaceId,
      channel,
    });
  },

  async setChannel(slackInstallId, { channel }) {
    await SlackInstall.update({ channel }, { where: { id: slackInstallId } });
  },
});

module.exports = SlackInstallService;
