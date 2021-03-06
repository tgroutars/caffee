const SlackClient = require('@slack/client').WebClient;

const { SlackUser, User, SlackWorkspace } = require('../models');
const { isUser, getUserVals } = require('../integrations/slack/helpers/user');

const SlackUserService = (/* services */) => ({
  async destroy({ where }) {
    await SlackUser.destroy({ where });
  },

  async findOrCreate({ email, image, name, slackId, workspaceId }) {
    const [user] = await User.findOrCreate({
      where: { email },
      defaults: { image, name },
    });

    const [slackUser, created] = await SlackUser.findOrCreate({
      where: { workspaceId, slackId },
      defaults: {
        userId: user.id,
        slackId,
        image,
        name,
      },
    });
    if (!created) {
      await slackUser.update({ slackId, image, name });
    }
    slackUser.user = user;

    return [slackUser, created];
  },

  async sync(userSlackId, workspaceSlackId) {
    const workspace = await SlackWorkspace.find({
      where: { slackId: workspaceSlackId },
    });
    const { accessToken } = workspace;
    const slackClient = new SlackClient(accessToken);
    const { user: userInfo } = await slackClient.users.info({
      user: userSlackId,
    });
    if (!isUser(userInfo)) {
      return null;
    }
    const { email, name, image } = getUserVals(userInfo);
    const [slackUser] = await this.findOrCreate({
      email,
      image,
      name,
      slackId: userSlackId,
      workspaceId: workspace.id,
    });
    return slackUser;
  },

  async findOrFetch(userSlackId, workspaceSlackId) {
    const existingSlackUser = await SlackUser.find({
      where: { slackId: userSlackId },
      include: [
        'user',
        {
          model: SlackWorkspace,
          as: 'workspace',
          where: { slackId: workspaceSlackId },
        },
      ],
    });
    if (existingSlackUser) {
      return existingSlackUser;
    }
    return this.sync(userSlackId, workspaceSlackId);
  },
});

module.exports = SlackUserService;
