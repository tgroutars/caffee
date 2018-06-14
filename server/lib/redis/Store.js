const redisClient = require('./client');

const DEFAULT_EXPIRE = 60 * 60 * 24 * 10; // 10 days

class Store {
  constructor(prefix, defaultExpire = DEFAULT_EXPIRE) {
    this.prefix = prefix;
    this.defaultExpire = defaultExpire;
  }

  async set(key, value, expire = this.defaultExpire) {
    const strValue = JSON.stringify(value);
    await redisClient.set(`${this.prefix}:${key}`, strValue, 'EX', expire);
    return key;
  }

  async get(key) {
    const strValue = await redisClient.get(`${this.prefix}:${key}`);
    return JSON.parse(strValue);
  }
}

module.exports = Store;
