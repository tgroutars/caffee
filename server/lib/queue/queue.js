const Redis = require('ioredis');
const kue = require('kue');

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
}, 1 * 60 * 1000);

if (process.env.NODE_ENV === 'development') {
  kue.app.listen(4000);
}

module.exports = queue;
