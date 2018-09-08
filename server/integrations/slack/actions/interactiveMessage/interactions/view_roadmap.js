const SlackClient = require('@slack/client').WebClient;

const getRoadmap = require('../../../helpers/getRoadmap');
const { postMessage, postEphemeral } = require('../../../messages');
const { ProductUser } = require('../../../../../models');
const { SlackPermissionError } = require('../../../../../lib/errors');

module.exports = async (payload, { workspace, slackUser, user }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { productId, page = 0 } = action.name;

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser) {
    throw new SlackPermissionError();
  }

  const { pageCount, roadmapItems, product, stages, isPM } = await getRoadmap(
    productId,
    user.id,
    { page },
  );

  const { accessToken } = workspace;
  const { channel: appChannel, ts: messageTS } = await postMessage('roadmap')({
    product,
    roadmapItems,
    page,
    pageCount,
    stages,
    isPM,
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
      user: slackUser.slackId,
    });
  }
};
