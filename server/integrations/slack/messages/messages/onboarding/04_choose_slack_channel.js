module.exports = ({ slackInstall }) => ({
  text: `Great! You now have a high level roadmap to showcase to your whole organization :hugging_face:

Hang on, we're getting there! My purpose is to keep everyone informed of roadmap updates.
Everytime you make progress on the roadmap, I'll post updates to a dedicated channel that every member of your organization can follow.
`,
  attachments: [
    {
      pretext: `Let's create a channel for that purpose :slightly_smiling_face:
You can also use one of your existing channels, but I highly recommend you don't pollute an existing conversation with the feed of roadmap update I'll send :wink:`,
      callback_id: 'create_channel',
      actions: [
        {
          type: 'button',
          text: `Create new channel`,
          name: {
            type: 'open_create_channel_dialog',
            slackInstallId: slackInstall.id,
          },
          value: 'open_create_channel_dialog',
        },
        {
          type: 'select',
          text: `Select channel`,
          data_source: 'channels',
          name: {
            type: 'select_channel',
            slackInstallId: slackInstall.id,
          },
        },
      ],
    },
  ],
});
