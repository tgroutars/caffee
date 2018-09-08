const { Product, ProductUser } = require('../../../../../models');
const { Product: ProductService } = require('../../../../../services');
const { SlackPermissionError } = require('../../../../../lib/errors');

const setTrelloBoard = async (payload, { slackUser, user }) => {
  const { action } = payload;
  const {
    selected_options: [selectedOption],
  } = action;
  const { productId } = action.name;
  const { boardId } = selectedOption.value;

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser || !productUser.isAdmin) {
    throw new SlackPermissionError();
  }

  await ProductService.setTrelloBoard(productId, boardId);
  await ProductService.doOnboarding(productId, {
    onboardingStep: Product.ONBOARDING_STEPS['04_CHOOSE_SLACK_CHANNEL'],
    slackUserId: slackUser.id,
  });
};

module.exports = setTrelloBoard;
