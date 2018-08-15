const Promise = require('bluebird');
const winston = require('winston');

const queue = require('../lib/queue/queue');

const listeners = {};
queue.process('event', 50, async (job, done) => {
  const { type, payload } = job.data;
  const eventListeners = listeners[type] || [];

  winston.info(`Envent: ${type}`);

  try {
    await Promise.map(eventListeners, async eventListener => {
      await eventListener(payload);
    });
    done();
  } catch (err) {
    winston.error(err);
    done(err);
  }
});

const addListener = (eventType, listener) => {
  listeners[eventType] = listeners[eventType] || [];
  listeners[eventType].push(listener);
};

const trigger = (eventType, payload) => {
  const job = queue
    .create('event', { type: eventType, payload })
    .removeOnComplete(true);
  job.save();
};

module.exports = { addListener, trigger };
