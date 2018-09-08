const SlackClient = require('@slack/client').WebClient;

const actions = require('./actions');
const { decode } = require('../../helpers/encoding');
const registerBackgroundTask = require('../../../../lib/registerBackgroundTask');
const { SlackUser, SlackWorkspace } = require('../../../../models');
const { SlackUserError } = require('../../../../lib/errors');

const messageAction = registerBackgroundTask(
  'message_action',
  async payload => {
    const {
      message,
      callback_id: callbackId,
      team: { id: workspaceSlackId },
      user: { id: userSlackId },
      channel: { id: channel },
    } = payload;

    const slackUser = await SlackUser.find({
      where: { slackId: userSlackId },
      include: [
        'user',
        {
          model: SlackWorkspace,
          as: 'workspace',
          where: { slackId: workspaceSlackId },
        },
      ],
    });
    if (!slackUser) {
      return;
    }

    const { workspace, user } = slackUser;

    const action = actions[callbackId];

    if (typeof action !== 'function') {
      throw new Error(`Unknow message action: ${callbackId}`);
    }

    message.text = await decode(workspace)(message.text);
    try {
      await action(payload, { workspace, slackUser, user });
    } catch (err) {
      if (err instanceof SlackUserError) {
        const slackClient = new SlackClient(workspace.accessToken);
        await slackClient.chat.postEphemeral({
          ...err.userMessage,
          channel,
          user: userSlackId,
        });
        return;
      }

      throw err;
    }
  },
);

module.exports = messageAction;
