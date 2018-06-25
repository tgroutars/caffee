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
      if (job.created_at < Date.now() - 7 * 24 * 60 * 60 * 1000) {
        job.remove();
      }
    });
  });
}, 1 * 60 * 1000);

if (process.env.NODE_ENV === 'development') {
  kue.app.listen(4000);
}

module.exports = queue;
