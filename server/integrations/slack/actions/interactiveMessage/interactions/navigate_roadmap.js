const { updateMessage } = require('../../../messages');
const getRoadmap = require('../../../helpers/getRoadmap');
const { ProductUser } = require('../../../../../models');
const { SlackPermissionError } = require('../../../../../lib/errors');

module.exports = async (payload, { workspace, user }) => {
  const {
    channel: { id: channel },
    message_ts: messageTS,
    action: { name, selected_options: selectedOptions },
  } = payload;

  const { productId, stageId, order, page = 0 } = name;

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser) {
    throw new SlackPermissionError();
  }

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
    isPM,
  } = await getRoadmap(productId, user.id, options);

  const { accessToken } = workspace;
  await updateMessage('roadmap')({
    pageCount,
    product,
    roadmapItems,
    stages,
    filterStage,
    isPM,
    page: options.page,
    order: options.order,
  })({
    accessToken,
    channel,
    ts: messageTS,
  });
};
