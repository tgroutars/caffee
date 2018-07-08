const { updateMessage } = require('../../../messages');
const getRoadmap = require('../../../helpers/getRoadmap');

module.exports = async (payload, { workspace }) => {
  const {
    channel: { id: channel },
    message_ts: messageTS,
    action: { name, selected_options: selectedOptions },
  } = payload;

  const { productId, stageId, order, page = 0 } = name;

  const options = { page, stageId, order };
  if (selectedOptions) {
    Object.assign(options, selectedOptions[0].value);
  }

  const {
    pageCount,
    roadmapItems,
    product,
    stages,
    filterStage,
  } = await getRoadmap(productId, options);

  const { accessToken } = workspace;
  await updateMessage('roadmap')({
    pageCount,
    product,
    roadmapItems,
    stages,
    filterStage,
    page: options.page,
    order: options.order,
  })({
    accessToken,
    channel,
    ts: messageTS,
  });
};
