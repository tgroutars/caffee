const { Product } = require('../../../../../models');
const { trigger } = require('../../../../../eventQueue/eventQueue');

module.exports = async (payload, { slackUser }) => {
  const { action } = payload;
  const { productId } = action.name;

  await trigger('onboarding', {
    onboardingStep: Product.ONBOARDING_STEPS['02_CONFIG_TRELLO'],
    productId,
    slackUserId: slackUser.id,
  });
};
