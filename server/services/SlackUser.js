const { SlackUser, User } = require('../models');

const SlackUserService = (/* services */) => ({
  async findOrCreate({ email, image, name, slackId, workspaceId }) {
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { image, name },
    });

    const [slackUser, created] = await SlackUser.findOrCreate({
      where: { workspaceId, userId: user.id },
      defaults: {
        slackId,
        image,
        name,
      },
    });
    slackUser.user = user;

    return [slackUser, created];
  },
});

module.exports = SlackUserService;
