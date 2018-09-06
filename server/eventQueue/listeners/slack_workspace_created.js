const { SlackWorkspace: SlackWorkspaceService } = require('../../services');

module.exports = async ({ workspaceId }) => {
  await SlackWorkspaceService.syncUsers(workspaceId);
};
