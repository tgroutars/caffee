module.exports = ({ product, slackUser }) => ({
  text: `Hi <!channel> :wave:
I'm Caffee, <@${
    slackUser.slackId
  }> added me to Slack to give you an easier way to:
- send feedback on ${product.name} to the product team
- follow updates on the roadmaps

From now on, sending a feedback to the product team will be as easy as using Slack :hugging_face:
I'll send roadmap updates to this channel so you can follow the product team's progress right from Slack
You can also decide to directly follow items of the roadmap, for example if you want to be notified when a specific feature has been released
`,
  attachments: [
    {
      text: `Click the button below if you want to know more, I'll give you some tips to get started :wink:`,
      callback_id: 'channel_onboarding',
      actions: [
        {
          text: 'Onboard me!',
          type: 'button',
          name: { type: 'onboard_me', productId: product.id },
          value: 'onboard_me',
        },
      ],
    },
  ],
});
