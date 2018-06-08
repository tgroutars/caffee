const { SlackInstall } = require('../models');

const SlackInstallService = (/* services */) => ({
  async create({ productId, workspaceId, channel = null }) {
    return SlackInstall.create({
      productId,
      workspaceId,
      channel,
    });
  },
});

SlackInstallService.key = 'SlackInstall';

module.exports = SlackInstallService;
