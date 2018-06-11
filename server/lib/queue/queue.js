const Redis = require('ioredis');
const kue = require('kue');

const { REDIS_URL = 'redis://127.0.0.1:6379' } = process.env;

const queue = kue.createQueue({
  redis: {
    createClientFactory: () => new Redis(REDIS_URL),
  },
});

if (process.env.NODE_ENV === 'development') {
  kue.app.listen(4000);
}

module.exports = queue;
