const events = require('./events');
const registerBackgroundTask = require('../../../lib/queue/registerBackgroundTask');

const handleEvent = registerBackgroundTask(async payload => {
  const { type } = payload.event;
  const event = events[type];
  if (!event) {
    return;
  }
  await event(payload);
});

module.exports = { handleEvent };
