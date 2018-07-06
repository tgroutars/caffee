const { updateMessage } = require('../../../messages');
const getRoadmap = require('../../../helpers/getRoadmap');

module.exports = async (payload, { workspace }) => {
  const {
    channel: { id: channel },
    message_ts: messageTS,
    action,
  } = payload;

  const { productId, page = 0 } = action.name;

  const { isLastPage, pageCount, roadmapItems, product } = await getRoadmap(
    productId,
    { page },
  );

  const { accessToken } = workspace;
  await updateMessage('roadmap')({
    isLastPage,
    page,
    pageCount,
    product,
    roadmapItems,
  })({
    accessToken,
    channel,
    ts: messageTS,
  });
};
