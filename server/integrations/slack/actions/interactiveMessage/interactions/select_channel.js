const SlackClient = require('@slack/client').WebClient;

const { postEphemeral } = require('../../../messages');
const {
  SlackInstall: SlackInstallService,
  Product: ProductService,
} = require('../../../../../services');
const { SlackInstall, Product } = require('../../../../../models');

module.exports = async (payload, { workspace, slackUser }) => {
  const {
    action,
    channel: { id: channel },
  } = payload;
  const { slackInstallId } = action.name;
  const [{ value: selectedChannel }] = action.selected_options;

  const { accessToken, appUserId } = workspace;
  const slackClient = new SlackClient(accessToken);
  try {
    await slackClient.conversations.info({ channel: selectedChannel });
  } catch (err) {
    if (err.data && err.data.error === 'no_permission') {
      await postEphemeral('channel_no_permission')({
        appUserId,
        channel: selectedChannel,
      })({ accessToken, channel, user: slackUser.slackId });
      return;
    }
  }
  const slackInstall = await SlackInstall.findById(slackInstallId, {
    include: ['product'],
  });
  const { product } = slackInstall;
  await SlackInstallService.setChannel(slackInstallId, {
    channel: selectedChannel,
  });
  if (
    product.onboardingStep ===
    Product.ONBOARDING_STEPS['04_CHOOSE_SLACK_CHANNEL']
  ) {
    await ProductService.doOnboarding(product.id, {
      onboardingStep: Product.ONBOARDING_STEPS['05_COMPLETE'],
      slackUserId: slackUser.id,
    });
  }
};
