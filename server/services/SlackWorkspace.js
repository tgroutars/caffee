const { SlackWorkspace } = require('../models');

module.exports = (/* services */) => ({
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
