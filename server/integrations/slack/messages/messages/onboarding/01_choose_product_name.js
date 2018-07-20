module.exports = ({ product, slackUser }) => ({
  text: `Hey <@${slackUser.slackId}> :wave:
I'm Caffee, here to help you collect feedback on your product and share progress with the rest of your organization :hugging_face:
You're almost set, but I want to make sure you start on the right foot
Let's take 3 minutes to get you up and running :runner:
First, let me get something straight :thinking_face:`,
  attachments: [
    {
      text: `Is the name of your product \`${product.name}\`?`,
      callback_id: 'choose_product_name',
      actions: [
        {
          type: 'button',
          text: `Yep`,
          name: {
            type: 'accept_product_name',
            productId: product.id,
          },
          value: 'accept_product_name',
        },
        {
          type: 'button',
          text: `Nope`,
          name: {
            type: 'open_product_name_dialog',
            productId: product.id,
          },
          value: 'open_product_name_dialog',
        },
      ],
    },
  ],
});
