const trim = require('lodash/trim');

const { Product } = require('../../../../../models');
const { Product: ProductService } = require('../../../../../services');

module.exports = async (payload, { slackUser }) => {
  const { submission, callback_id: callbackId } = payload;
  const { productId } = callbackId;
  const name = trim(submission.name);

  await ProductService.setName(productId, {
    name,
  });
  const product = await Product.findById(productId);
  if (
    product.onboardingStep ===
    Product.ONBOARDING_STEPS['01_CHOOSE_PRODUCT_NAME']
  ) {
    await ProductService.doOnboarding(productId, {
      onboardingStep: Product.ONBOARDING_STEPS['02_INSTALL_TRELLO'],
      slackUserId: slackUser.id,
    });
  }
};
