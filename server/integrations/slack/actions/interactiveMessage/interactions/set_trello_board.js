const { Product: ProductService } = require('../../../../../services');

const setTrelloBoard = async payload => {
  const { action } = payload;
  const {
    selected_options: [selectedOption],
  } = action;
  const { productId } = action.name;
  const { boardId } = selectedOption.value;

  await ProductService.setTrelloBoard(productId, boardId);
};

module.exports = setTrelloBoard;
