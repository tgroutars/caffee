const { Product, SlackUser } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');
const { listBoards } = require('../../integrations/trello/helpers/api');

const postChooseBoardMessage = postMessage('choose_board');

const trelloInstalled = async ({
  productId,
  installer: { userId, workspaceId },
}) => {
  const product = await Product.findById(productId);

  const slackUser = await SlackUser.find({
    where: {
      userId,
      workspaceId,
    },
    include: ['workspace'],
  });
  const { workspace, slackId: userSlackId } = slackUser;
  const { accessToken } = workspace;

  const boards = await listBoards(product.trelloAccessToken);

  await postChooseBoardMessage({
    product,
    boards,
  })({
    accessToken,
    channel: userSlackId,
  });
};

module.exports = trelloInstalled;
