module.exports = ({ slackUser }) => ({
  text: `Invitation sent to <@${slackUser.slackId}> to follow this item`,
});
