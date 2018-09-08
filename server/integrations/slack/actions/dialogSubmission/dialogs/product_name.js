const trim = require('lodash/trim');

const { Product, ProductUser } = require('../../../../../models');
const { Product: ProductService } = require('../../../../../services');
const { SlackPermissionError } = require('../../../../../lib/errors');

module.exports = async (payload, { slackUser, user }) => {
  const { submission, callback_id: callbackId } = payload;
  const { productId } = callbackId;
  const name = trim(submission.name);

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser || !productUser.isAdmin) {
    throw new SlackPermissionError();
  }

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
