const { Product, ProductUser } = require('../../../../../models');
const { Product: ProductService } = require('../../../../../services');
const { SlackPermissionError } = require('../../../../../lib/errors');

module.exports = async (payload, { slackUser, user }) => {
  const { action } = payload;
  const { productId } = action.name;

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser || !productUser.isAdmin) {
    throw new SlackPermissionError();
  }

  const product = await Product.findById(productId);
  await ProductService.createTrelloBoard(product);
  await ProductService.doOnboarding(productId, {
    onboardingStep: Product.ONBOARDING_STEPS['04_CHOOSE_SLACK_CHANNEL'],
    slackUserId: slackUser.id,
  });
};
