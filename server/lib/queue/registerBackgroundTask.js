const winston = require('winston');
const uuidv4 = require('uuid/v4');

const queue = require('./queue');

const jobs = {};

queue.process('job', 50, async (job, done) => {
  const { jobId, args } = job.data;
  const func = jobs[jobId];

  try {
    await func(...args);
    done();
  } catch (err) {
    winston.error(err);
    done(err);
  }
});

const registerBackgroundTask = func => {
  const jobId = uuidv4();
  jobs[jobId] = func;

  return async (...args) => {
    await queue
      .create('job', { jobId, args })
      .removeOnComplete(true)
      .save();
  };
};

module.exports = registerBackgroundTask;
