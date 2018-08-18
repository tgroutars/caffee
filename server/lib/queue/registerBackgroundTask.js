const winston = require('winston');

const queue = require('./queue');

const jobs = {};

queue.process('backgroundTask', 50, async (job, done) => {
  const { name, args } = job.data;
  const func = jobs[name];

  try {
    await func(...args);
    done();
  } catch (err) {
    winston.error(err, { func, args });
    done(err);
  }
});

module.exports = (name, func) => {
  jobs[name] = func;

  return async (...args) => {
    await queue
      .create('backgroundTask', { name, args })
      .removeOnComplete(true)
      .save();
  };
};
