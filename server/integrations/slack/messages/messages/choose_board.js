const chooseBoard = ({ product, boards }) => {
  const pretext = 'Choose a board to create your roadmap';
  const actions = [
    {
      type: 'select',
      text: 'Select a Trello board',
      name: {
        type: 'set_trello_board',
        productId: product.id,
      },
      options: boards.map(board => ({
        text: board.name,
        value: {
          boardId: board.id,
        },
      })),
    },
  ];
  return {
    attachments: [
      {
        actions,
        pretext,
        callback_id: 'feedback_choose_product',
      },
    ],
  };
};

module.exports = chooseBoard;
