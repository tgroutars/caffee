const Promise = require('bluebird');
const winston = require('winston');
const Queue = require('bee-queue');

const { REDIS_URL = 'redis://127.0.0.1:6379' } = process.env;

const queue = new Queue('event', {
  redis: REDIS_URL,
  removeOnSuccess: true,
});

const listeners = {};
queue.process(50, async job => {
  const { type, payload } = job.data;
  const eventListeners = listeners[type] || [];

  winston.info(`event process: ${type}`);

  await Promise.map(eventListeners, async eventListener => {
    try {
      await eventListener(payload);
    } catch (err) {
      winston.error(`Error processing event ${type}:`);
      winston.error(err);
      winston.error(`payload: ${JSON.stringify(payload)}`);
    }
  });
});

const addListener = (eventType, listener) => {
  listeners[eventType] = listeners[eventType] || [];
  listeners[eventType].push(listener);
};

const trigger = (eventType, payload) => {
  winston.info(`event trigger: ${eventType}`);
  queue.createJob({ type: eventType, payload }).save();
};

module.exports = { addListener, trigger };
