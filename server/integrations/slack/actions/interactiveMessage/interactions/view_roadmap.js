const SlackClient = require('@slack/client').WebClient;

const getRoadmap = require('../../../helpers/getRoadmap');
const { postMessage, postEphemeral } = require('../../../messages');

module.exports = async (payload, { workspace, slackUser }) => {
  const {
    action,
    channel: { id: channel },
    user: { id: userSlackId },
  } = payload;
  const { productId, page = 0 } = action.name;
  const { pageCount, roadmapItems, product, stages } = await getRoadmap(
    productId,
    { page },
  );

  const { accessToken } = workspace;
  const { channel: appChannel, ts: messageTS } = await postMessage('roadmap')({
    product,
    roadmapItems,
    page,
    pageCount,
    stages,
  })({
    accessToken,
    channel: slackUser.slackId,
  });
  if (channel !== appChannel) {
    const slackClient = new SlackClient(accessToken);
    const { permalink: messageLink } = await slackClient.chat.getPermalink({
      channel: appChannel,
      message_ts: messageTS,
    });

    await postEphemeral('roadmap_sent')({ messageLink })({
      accessToken,
      channel,
      user: userSlackId,
    });
  }
};
