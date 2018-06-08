const redisClient = require('./client');
const crypto = require('crypto');

const DEFAULT_EXPIRE = 60 * 24 * 24 * 10; // 10 days

class ObjectStore {
  constructor(prefix, defaultExpire = DEFAULT_EXPIRE) {
    this.prefix = prefix;
    this.defaultExpire = defaultExpire;
  }

  async set(obj, expire = this.defaultExpire) {
    const value = JSON.stringify(obj);
    const key = crypto
      .createHash('sha1')
      .update(value)
      .digest('hex');
    await redisClient.set(`${this.prefix}:${key}`, value, 'EX', expire);

    return key;
  }

  async get(key) {
    const value = await redisClient.get(`${this.prefix}:${key}`);

    return JSON.parse(value);
  }
}

module.exports = ObjectStore;
