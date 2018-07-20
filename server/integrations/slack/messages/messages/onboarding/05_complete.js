module.exports = ({ product }) => ({
  text: `Congrats, you're all set! :tada:
Next steps:
- If not already done, create some items in your roadmap to tell everyone what your team is working on => <${product.getTrelloBoardURL()}|Open your board>
- Try sending a feedback or creating a roadmap item. Just summon me by either talking to me, @mentioning me, using the \`/caffee\` command, or using message actions (select the three dots next to a message, then click 'Send feedback' or 'Create roadmap item')
- Invite your organization members to the channel you just created, so they can follow the progress you make on the roadmap
- Send a message to your users explaining how they should send a feedback to you

If you have any questions, don't hesitate to e-mail my creator <mailto:thomas@caffee.io|Thomas>, he'll be glad to answer any questions you may have
`,
});
