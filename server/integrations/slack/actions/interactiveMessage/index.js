const Promise = require('bluebird');
const SlackClient = require('@slack/client').WebClient;

const HashStore = require('../../../../lib/redis/HashStore');
const interactions = require('./interactions');
const { postEphemeral } = require('../../messages');
const { SlackUser, SlackWorkspace } = require('../../../../models');
const { SlackUserError } = require('../../../../lib/errors');

const actionValueStore = new HashStore('slack:action_value');

/**
 * Retrieve action value from Redis
 */
const preProcessPayload = async payload => {
  const {
    actions: [action],
  } = payload;
  const name = await actionValueStore.get(action.name);
  return {
    ...payload,
    action: {
      ...action,
      name,
      selected_options:
        action.selected_options &&
        (await Promise.map(action.selected_options, async option => ({
          ...option,
          value:
            (option.value && (await actionValueStore.get(option.value))) ||
            option.value,
        }))),
    },
  };
};

const interactiveMessage = async rawPayload => {
  const payload = await preProcessPayload(rawPayload);
  const {
    action,
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

  if (!action.name) {
    await postEphemeral('action_expired')()({
      channel,
      user: slackUser.slackId,
      accessToken: workspace.accessToken,
    });
    return;
  }
  const { type } = action.name;
  const interaction = interactions[type];
  if (typeof interaction !== 'function') {
    throw new Error(`Unknow interaction: ${type}`);
  }
  try {
    await interaction(payload, { workspace, slackUser, user });
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
};

module.exports = interactiveMessage;
