const { SlackInstall: SlackInstallService } = require('../../services');

const slackInstallCreated = async ({ slackInstallId }) => {
  await SlackInstallService.syncUsers(slackInstallId);
};

module.exports = slackInstallCreated;
