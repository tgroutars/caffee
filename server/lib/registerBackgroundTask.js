const winston = require('winston');
const Queue = require('bee-queue');

const { REDIS_URL = 'redis://127.0.0.1:6379' } = process.env;

const queue = new Queue('backgroundTask', {
  redis: REDIS_URL,
  removeOnSuccess: true,
});

const jobs = {};
queue.process(50, async (job, done) => {
  const { name, args } = job.data;
  const func = jobs[name];

  try {
    await func(...args);
    done();
  } catch (err) {
    winston.error(`Error processing background task: ${name}`);
    winston.error(err);
    winston.error(JSON.stringify({ func, args }));
    done(err);
  }
});

module.exports = (name, func) => {
  jobs[name] = func;

  return async (...args) => {
    await queue.createJob({ name, args }).save();
  };
};
