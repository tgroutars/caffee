const crypto = require('crypto');

const Store = require('./Store');

class HashStore {
  constructor(prefix, defaultExpire) {
    this.store = new Store(prefix, defaultExpire);
  }

  async set(value, expire) {
    const strValue = JSON.stringify(value);
    const key = crypto
      .createHash('sha1')
      .update(strValue)
      .digest('hex');
    await this.store.set(key, value, expire);
    return key;
  }

  async get(key) {
    return this.store.get(key);
  }
}

module.exports = HashStore;
