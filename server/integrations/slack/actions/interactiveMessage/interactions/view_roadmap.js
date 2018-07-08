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
  const { channel: appChannel } = await postMessage('roadmap')({
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
    await postEphemeral('roadmap_sent')({ appChannel })({
      accessToken,
      channel,
      user: userSlackId,
    });
  }
};
