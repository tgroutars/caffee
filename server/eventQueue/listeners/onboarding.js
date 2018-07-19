const Promise = require('bluebird');
const { postMessage } = require('../../integrations/slack/messages');

const { Product, SlackUser } = require('../../models');

module.exports = async ({ productId, slackUserId, onboardingStep }) => {
  const [product, slackUser] = await Promise.all([
    Product.findById(productId),
    SlackUser.findById(slackUserId, { include: ['workspace'] }),
  ]);
  const { workspace } = slackUser;
  const { accessToken } = workspace;

  await postMessage('onboarding')(onboardingStep, { product, slackUser })({
    accessToken,
    channel: slackUser.slackId,
  });
};
