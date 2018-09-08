const { Product: ProductService } = require('../../../../../services');
const { Product, ProductUser } = require('../../../../../models');
const { SlackPermissionError } = require('../../../../../lib/errors');

module.exports = async (payload, { slackUser, user }) => {
  const { action } = payload;
  const { productId } = action.name;

  const productUser = await ProductUser.find({
    where: { userId: user.id, productId },
  });
  if (!productUser || !productUser.isAdmin) {
    throw new SlackPermissionError();
  }
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
