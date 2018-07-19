const { Product: ProductService } = require('../../services');
const { Product, SlackUser } = require('../../models');

const trelloInstalled = async ({
  productId,
  installer: { userId, workspaceId },
}) => {
  const product = await Product.findById(productId);

  if (
    product.onboardingStep === Product.ONBOARDING_STEPS['02_INSTALL_TRELLO']
  ) {
    const slackUser = await SlackUser.find({
      where: {
        userId,
        workspaceId,
      },
      include: ['workspace'],
    });
    ProductService.doOnboarding(productId, {
      onboardingStep: Product.ONBOARDING_STEPS['03_CHOOSE_TRELLO_BOARD'],
      slackUserId: slackUser.id,
    });
  }
};

module.exports = trelloInstalled;
