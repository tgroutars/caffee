const events = require('./events');
const { SlackWorkspace } = require('../../../models');
const registerBackgroundTask = require('../../../lib/queue/registerBackgroundTask');

const handleEvent = registerBackgroundTask(
  'slack_handle_event',
  async payload => {
    const { type } = payload.event;
    const event = events[type];
    if (!event) {
      return;
    }
    const { team_id: workspaceSlackId } = payload;
    const workspace = await SlackWorkspace.find({
      where: { slackId: workspaceSlackId },
    });
    if (!workspace) {
      return;
    }
    await event(payload, { workspace });
  },
);

module.exports = { handleEvent };
