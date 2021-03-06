const Promise = require('bluebird');
const { postMessage } = require('../../integrations/slack/messages');

const { Product, SlackUser, SlackInstall } = require('../../models');

module.exports = async ({ productId, slackUserId, onboardingStep }) => {
  const [product, slackUser] = await Promise.all([
    Product.findById(productId),
    SlackUser.findById(slackUserId, { include: ['workspace'] }),
  ]);
  const { workspace } = slackUser;
  const { accessToken } = workspace;
  const slackInstall = await SlackInstall.find({
    where: { productId, workspaceId: workspace.id },
  });

  await postMessage('onboarding')(onboardingStep, {
    product,
    slackUser,
    slackInstall,
  })({
    accessToken,
    channel: slackUser.slackId,
  });
};
