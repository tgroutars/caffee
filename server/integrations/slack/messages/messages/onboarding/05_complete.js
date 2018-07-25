module.exports = ({ product, slackInstall }) => ({
  text: `Congrats, you're all set! :tada:
Next steps:
*1/ Create your roadmap*
If not already done, create some items in your roadmap to tell everyone what your team is working on => <${product.getTrelloBoardURL()}|Open your board>

*2/ Play around with me*
Try sending a feedback or creating a roadmap item. Just summon me by either talking to me, @mentioning me, using the \`/caffee\` command, or using message actions (select the three dots next to a message, then click 'Send feedback' or 'Create roadmap item')
You can invite a few people in the channel and explain to them how it works before you roll it out to your whole organisation

*3/ Let people know I exist*
When you're ready to onboard everyone, add them in the <#${
    slackInstall.channel
  }> channel, then press the 'Send onboarding message' button below. I'll send them an intro message and tell them how I'll help them send feedback to the product team

If you have any questions, don't hesitate to e-mail my creator <mailto:thomas@caffee.io|Thomas>, he'll be glad to answer any questions you may have
`,
  attachments: [
    {
      text: `Ready to onboard your organisation? Make sure you invited people in the <#${
        slackInstall.channel
      }> channel first`,
      callback_id: 'onboarding:05_complete',
      actions: [
        {
          text: `Send onboarding message`,
          type: 'button',
          name: {
            type: 'send_onboarding_message',
            slackInstallId: slackInstall.id,
          },
          value: 'send_onboarding_message',
        },
      ],
    },
  ],
});
