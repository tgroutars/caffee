module.exports = ({ product }) => ({
  text: `Ok, now select a Trello board you'll use as a high-level roadmap`,
  attachments: [
    {
      pretext: `If you don't have one already, I can create one for you :slightly_smiling_face:`,
      callback_id: 'choose_trello_board',
      actions: [
        {
          type: 'select',
          text: `Select a board`,
          data_source: 'external',
          name: {
            type: 'set_trello_board',
            productId: product.id,
          },
          value: 'set_trello_board',
        },
        {
          type: 'button',
          text: `Create a new board`,
          name: {
            type: 'create_trello_board',
            productId: product.id,
          },
          value: 'create_trello_board',
        },
      ],
    },
  ],
});
