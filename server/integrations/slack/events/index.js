const events = require('./events');
const registerBackgroundTask = require('../../../lib/queue/registerBackgroundTask');

const handleEvent = registerBackgroundTask(async (payload, state) => {
  const { type } = payload.event;
  const event = events[type];
  if (!event) {
    return;
  }
  await event(payload, state);
});

module.exports = { handleEvent };
