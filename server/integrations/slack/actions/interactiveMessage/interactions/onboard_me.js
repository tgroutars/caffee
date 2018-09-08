const SlackClient = require('@slack/client').WebClient;

const { Product } = require('../../../../../models');
const { postMessage, postEphemeral } = require('../../../messages');

// TODO: Remove this
module.exports = async (payload, { slackUser, workspace }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { productId } = action.name;
  const { accessToken } = workspace;
  const product = await Product.findById(productId);
  const { channel: appChannel, ts: messageTS } = await postMessage(
    'user_onboarding',
  )({ product, slackUser })({
    accessToken,
    channel: slackUser.slackId,
  });
  const slackClient = new SlackClient(accessToken);
  const { permalink: messageLink } = await slackClient.chat.getPermalink({
    channel: appChannel,
    message_ts: messageTS,
  });

  await postEphemeral('user_onboarding_sent')({ messageLink })({
    accessToken,
    channel,
    user: slackUser.slackId,
  });
};
