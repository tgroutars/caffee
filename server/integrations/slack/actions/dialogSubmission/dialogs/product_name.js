const trim = require('lodash/trim');

const { Product } = require('../../../../../models');
const { trigger } = require('../../../../../eventQueue/eventQueue');
const { Product: ProductService } = require('../../../../../services');

module.exports = async (payload, { slackUser }) => {
  const { submission, callback_id: callbackId } = payload;
  const { productId } = callbackId;
  const name = trim(submission.name);

  await ProductService.setName(productId, {
    name,
  });
  await trigger('onboarding', {
    onboardingStep: Product.ONBOARDING_STEPS['02_CONFIG_TRELLO'],
    productId,
    slackUserId: slackUser.id,
  });
};
