const crypto = require('crypto');
const Promise = require('bluebird');

const Store = require('./redis/Store');

const randomBytes = Promise.promisify(crypto.randomBytes);

const tokenStore = new Store('auth:token', 60 * 60 * 24 * 100); // Expire in 100 days

const authenticate = async token => tokenStore.get(token);

const login = async userId => {
  const token = await randomBytes(64).toString('hex');
  await tokenStore.set(token, userId);
  return token;
};

module.exports = {
  authenticate,
  login,
};
