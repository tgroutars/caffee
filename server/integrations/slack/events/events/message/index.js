const appHome = require('./app_home');
const channel = require('./channel');

const message = async payload => {
  const { channel_type: channelType, subtype } = payload.event;
  if (subtype) {
    return;
  }
  switch (channelType) {
    case 'app_home':
      await appHome(payload);
      break;
    case 'channel':
    case 'groups':
      await channel(payload);
      break;
    default:
  }
};

module.exports = message;
