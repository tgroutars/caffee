module.exports = ({ slackUser }) => ({
  text: `Sorry, I don't have the permission to message <@${
    slackUser.slackId
  }> :disappointed:
They need to interact with me first by using the \`/caffee\` command`,
});
