module.exports = ({ product }) => ({
  text: `Awesome, I already love ${product.name} :hugging_face:
Let's make it a little better everyday with some help from your teammates
First, you'll need a high level roadmap to share with your organisation. Let's use a Trello board for that`,
  attachments: [
    {
      text: `Connect your Trello account`,
      callback_id: 'connect_trello',
      actions: [
        {
          type: 'button',
          text: `Connect`,
          name: {
            type: 'connect_trello',
            productId: product.id,
          },
          value: 'connect_trello',
        },
      ],
    },
  ],
});
