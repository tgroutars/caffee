const { Product } = require('../../../../../models');
const { Product: ProductService } = require('../../../../../services');

module.exports = async (payload, { slackUser }) => {
  const { action } = payload;
  const { productId } = action.name;
  const product = await Product.findById(productId);
  await ProductService.createTrelloBoard(product);
  await ProductService.doOnboarding(productId, {
    onboardingStep: Product.ONBOARDING_STEPS['04_CHOOSE_SLACK_CHANNEL'],
    slackUserId: slackUser.id,
  });
};
