const SlackClient = require('@slack/client').WebClient;
const Promise = require('bluebird');

const messages = require('./messages');
const HashStore = require('../../../lib/redis/HashStore');

const actionValueStore = new HashStore('slack:action_value');

/**
 * Store message action values in Redis
 */
const preProcessMessage = async rawMessage => ({
  ...rawMessage,
  attachments: await Promise.map(
    rawMessage.attachments || [],
    async attachment => ({
      ...attachment,
      actions: await Promise.map(attachment.actions || [], async action => ({
        ...action,
        value: action.value && (await actionValueStore.set(action.value)),
        options:
          action.options &&
          (await Promise.map(action.options, async option => ({
            ...option,
            value: option.value && (await actionValueStore.set(option.value)),
          }))),
      })),
    }),
  ),
});

const getPostMessage = isEphemeral => type => {
  const getMessage = messages[type];
  if (!getMessage) {
    throw new Error(`Unknown message: ${type}`);
  }

  const method = isEphemeral ? 'chat.postEphemeral' : 'chat.postMessage';

  return (...messageArgs) => {
    const rawMessage = getMessage(...messageArgs);
    return async ({ accessToken, channel, user }) => {
      const message = await preProcessMessage(rawMessage);
      const slackClient = new SlackClient(accessToken);
      await slackClient.apiCall(method, {
        ...message,
        channel,
        user,
      });
    };
  };
};

const postMessage = getPostMessage(false);
const postEphemeral = getPostMessage(true);

module.exports = {
  postMessage,
  postEphemeral,
};
