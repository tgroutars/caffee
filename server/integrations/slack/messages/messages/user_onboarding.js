module.exports = ({ product, slackUser }) => ({
  text: `Hi <@${slackUser.slackId}> :wave:

Glad you're interested in learning more :blush:
I'm here to help you and your other teammates engage better with the product team. My goal is two-fold, I'll
- give you an easier way to send feedbacks on ${product.name}
- help you keep track of the progress the product team is making

Whenever you need me, you'll have 3 different ways to summon me. You don't have to remember them all, one should suffice :slightly_smiling_face:
- type the \`/caffee\` command
- mention me by typing @Caffee
- or send me a DM (by sending a message to this very conversation)

Whenever you call for my help, I'll give you 2 options:
- Send a new feedback
- View the roadmap

There's actually a 4th way to send a feedback. When you or someone else types a message that you think might be interesting for the product team, select the three dots next to the message and press 'Send feedback'

*Why should I send feedbacks through Caffee and not just talk to the Product Manager? :thinking_face:*
Let's say you have a super idea for a new feature. If the product team is willing to consider it, or is already working on it, they'll link it to an item of the roadmap.
Now when your new feature gets released, I'll be able to personally let you know :blush:

*Can I willingly decide to follow specific items of the roadmap and get notified of their progress?*
Of course! When you summon me, you'll have the option to 'View the roadmap'. I'll send you the roadmap as a navigable message, and you'll be able to pick any item you want to follow

That's it for now! If you have a question, never hesitate to send an email to my creator <mailto:thomas@caffee.io|Thomas>, he'll be glad to answer any questions you may have :slightly_smiling_face:
`,
});
