const trim = require('lodash/trim');
const trimStart = require('lodash/trimStart');
const SlackClient = require('@slack/client').WebClient;

const {
  SlackInstall: SlackInstallService,
  Product: ProductService,
} = require('../../../../../services');
const { SlackInstall, Product } = require('../../../../../models');
const { SlackDialogSubmissionError } = require('../../../../../lib/errors');

const handleError = err => {
  const slackErrorCode = err.data && err.data.error;
  if (!slackErrorCode) {
    throw err;
  }
  if (slackErrorCode === 'name_taken') {
    throw new SlackDialogSubmissionError([
      {
        name: 'channel',
        error: 'A channel with this name already exists',
      },
    ]);
  }
  if (slackErrorCode && slackErrorCode.startsWith('invalid_name')) {
    throw new SlackDialogSubmissionError([
      {
        name: 'channel',
        error: 'Invalid channel name',
      },
    ]);
  }
  throw err;
};

// We need to actually create the channel to validate the channel name
// So we just create it in the validate
const validate = async (payload, { slackUser, workspace }) => {
  const { submission, callback_id: callbackId } = payload;
  const { slackInstallId } = callbackId;
  const channelName = trimStart(trim(submission.channel), '#');
  const { accessToken } = workspace;
  const slackClient = new SlackClient(accessToken);

  const slackInstall = await SlackInstall.findById(slackInstallId, {
    include: ['product'],
  });

  const { product } = slackInstall;

  // TODO: Don't create channel if already exists

  try {
    const { channel } = await slackClient.conversations.create({
      name: channelName,
      is_private: false,
      user_ids: slackUser.slackId,
    });
    await SlackInstallService.setChannel(slackInstall.id, {
      channel: channel.id,
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
  } catch (err) {
    await handleError(err);
  }
};

module.exports = {
  validate,
  run: async () => {},
};
