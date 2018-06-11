const SlackClient = require('@slack/client').WebClient;

const { SlackUser, SlackWorkspace } = require('../../../models');
const { SlackUser: SlackUserService } = require('../../../services');

const isUser = user => !user.is_bot && !user.deleted && user.profile.email;

const getUserVals = userInfo => {
  const { profile, id: slackId } = userInfo;
  const { real_name: name, image_512: image, email } = profile;

  return {
    email,
    name,
    slackId,
    image,
  };
};

const syncSlackUser = async (userSlackId, workspaceSlackId) => {
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
  const [slackUser] = await SlackUserService.findOrCreate({
    email,
    image,
    name,
    slackId: userSlackId,
    workspaceId: workspace.id,
  });
  return slackUser;
};

const findOrFetchSlackUser = async (userSlackId, workspaceSlackId) => {
  const existingSlackUser = await SlackUser.find({
    where: { slackId: userSlackId },
  });
  if (existingSlackUser) {
    return existingSlackUser;
  }
  return syncSlackUser(userSlackId, workspaceSlackId);
};

module.exports = {
  isUser,
  getUserVals,
  syncSlackUser,
  findOrFetchSlackUser,
};
