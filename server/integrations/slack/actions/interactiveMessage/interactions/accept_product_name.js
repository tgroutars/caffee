const {
  Product: ProductService,
} = require('../../../../../eventQueue/listeners');
const { Product } = require('../../../../../models');

module.exports = async (payload, { slackUser }) => {
  const { action } = payload;
  const { productId } = action.name;

  const product = await Product.findById(productId);
  if (
    product.onboardingStep ===
    Product.ONBOARDING_STEPS['01_CHOOSE_PRODUCT_NAME']
  ) {
    ProductService.doOnboarding(productId, {
      onboardingStep: Product.ONBOARDING_STEPS['02_INSTALL_TRELLO'],
      slackUserId: slackUser.id,
    });
  }
};
