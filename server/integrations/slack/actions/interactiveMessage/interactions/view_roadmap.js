const getRoadmap = require('../../../helpers/getRoadmap');
const { postMessage } = require('../../../messages');

module.exports = async (payload, { workspace, slackUser }) => {
  const { action } = payload;
  const { productId, page = 0 } = action.name;
  const { isLastPage, pageCount, roadmapItems, product } = await getRoadmap(
    productId,
    { page },
  );

  const { accessToken } = workspace;
  await postMessage('roadmap')({
    product,
    roadmapItems,
    page,
    isLastPage,
    pageCount,
  })({
    accessToken,
    channel: slackUser.slackId,
  });
};
