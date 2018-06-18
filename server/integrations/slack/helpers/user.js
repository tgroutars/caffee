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

module.exports = {
  isUser,
  getUserVals,
};
