const Redis = require('ioredis');

const { REDIS_URL = 'redis://127.0.0.1:6379' } = process.env;

module.exports = new Redis(REDIS_URL, { keyPrefix: 'caffee:' });
