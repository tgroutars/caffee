const { updateMessage } = require('../../../messages');
const getRoadmap = require('../../../helpers/getRoadmap');

module.exports = async (payload, { workspace }) => {
  const {
    channel: { id: channel },
    message_ts: messageTS,
    action: { name, selected_options: selectedOptions },
  } = payload;

  const { productId, page = 0, stageId } = name;

  const options = { page, stageId };

  if (selectedOptions) {
    Object.assign(options, selectedOptions[0].value);
  }

  const { pageCount, roadmapItems, product, stages } = await getRoadmap(
    productId,
    options,
  );

  const { accessToken } = workspace;
  await updateMessage('roadmap')({
    pageCount,
    product,
    roadmapItems,
    stages,
    ...options,
  })({
    accessToken,
    channel,
    ts: messageTS,
  });
};
