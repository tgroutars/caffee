const appHome = require('./app_home');
const channel = require('./channel');

const message = async (payload, state) => {
  const { channel_type: channelType } = payload.event;
  switch (channelType) {
    case 'app_home':
      await appHome(payload, state);
      break;
    case 'channel':
    case 'group':
    case 'im':
    case 'mpim':
      await channel(payload, state);
      break;
    default:
  }
};

module.exports = message;
