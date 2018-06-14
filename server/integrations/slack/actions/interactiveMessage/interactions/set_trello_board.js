const { Product: ProductService } = require('../../../../../services');

const setTrelloBoard = async payload => {
  const {
    action: {
      selected_options: [selectedOption],
    },
  } = payload;
  const { boardId, productId } = selectedOption.value;

  await ProductService.setTrelloBoard(productId, boardId);
};

module.exports = setTrelloBoard;
