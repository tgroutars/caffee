module.exports = ({ product }) => ({
  text: `Great! You now have a high level roadmap to showcase to your whole organisation :hugging_face:

Hang on, we're getting there! My purpose is to keep everyone informed of roadmap updates.
Everytime you make progress on the roadmap, I'll post updates to a dedicated channel that every member of your organisation can follow.
`,
  attachments: [
    {
      pretext: `Let's create a channel for that purpose :slightly_smiling_face:`,
      callback_id: 'create_channel',
      actions: [
        {
          type: 'button',
          text: `Create a new channel`,
          name: {
            type: 'open_create_channel_dialog',
            productId: product.id,
          },
          value: 'open_create_channel_dialog',
        },
      ],
    },
  ],
});
