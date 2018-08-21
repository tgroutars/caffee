const Promise = require('bluebird');

const HashStore = require('../../../../lib/redis/HashStore');
const interactions = require('./interactions');
const { postEphemeral } = require('../../messages');
const { SlackUser, SlackWorkspace } = require('../../../../models');

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
    const {
      channel: { id: channel },
    } = payload;
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

  await interaction(payload, { workspace, slackUser, user });
};

module.exports = interactiveMessage;
