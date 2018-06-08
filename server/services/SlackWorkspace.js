const { SlackWorkspace } = require('../models');

const SlackWorkspaceService = (/* services */) => ({
  async findOrCreate({
    accessToken,
    appId,
    appUserId,
    domain,
    image,
    name,
    slackId,
  }) {
    return SlackWorkspace.findOrCreate({
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
  },
});

SlackWorkspaceService.key = 'SlackWorkspace';

module.exports = SlackWorkspaceService;
