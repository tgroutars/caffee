const { postMessage } = require('../../../messages');
const { SlackInstall } = require('../../../../../models');

// TODO: remove this
module.exports = async (payload, { workspace, slackUser }) => {
  const { action } = payload;
  const { slackInstallId } = action.name;
  const slackInstall = await SlackInstall.findById(slackInstallId, {
    include: ['product'],
  });
  const { product, channel: caffeeChannel } = slackInstall;
  const { accessToken } = workspace;
  await postMessage('channel_onboarding')({ product, slackUser })({
    accessToken,
    channel: caffeeChannel,
  });
};
