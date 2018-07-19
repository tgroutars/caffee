const { Product } = require('../../../../../models');
const { Product: ProductService } = require('../../../../../services');

const setTrelloBoard = async (payload, { slackUser }) => {
  const { action } = payload;
  const {
    selected_options: [selectedOption],
  } = action;
  const { productId } = action.name;
  const { boardId } = selectedOption.value;

  await ProductService.setTrelloBoard(productId, boardId);
  await ProductService.doOnboarding(productId, {
    onboardingStep: Product.ONBOARDING_STEPS['04_CREATE_CHANNEL'],
    slackUserId: slackUser.id,
  });
};

module.exports = setTrelloBoard;
