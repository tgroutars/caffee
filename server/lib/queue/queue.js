const Redis = require('ioredis');
const kue = require('kue');
const winston = require('winston');

const { REDIS_URL = 'redis://127.0.0.1:6379' } = process.env;

const queue = kue.createQueue({
  redis: {
    createClientFactory: () => new Redis(REDIS_URL),
  },
});

// Remove failed jobs every hour
setInterval(() => {
  kue.Job.rangeByState('failed', 0, 1000, 1, (err, jobs) => {
    jobs.forEach(job => {
      job.remove();
    });
  });
}, 60 * 60 * 1000);

if (process.env.NODE_ENV === 'development') {
  kue.app.listen(4000);
}

process.once('SIGTERM', () => {
  queue.shutdown(5000, err => {
    winston.info('Kue shutdown: ', err || '');
    process.exit(0);
  });
});

module.exports = queue;
