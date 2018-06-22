const isUser = user => !user.is_bot && !user.deleted && user.profile.email;

const getUserVals = userInfo => {
  const { profile, id: slackId, team_id: workspaceSlackId } = userInfo;
  const { real_name: name, image_512: image, email } = profile;

  return {
    email,
    name,
    slackId,
    image,
    workspaceSlackId,
  };
};

module.exports = {
  isUser,
  getUserVals,
};
