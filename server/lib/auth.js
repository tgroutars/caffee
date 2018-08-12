const crypto = require('crypto');
const Promise = require('bluebird');

const Store = require('./redis/Store');

const randomBytes = Promise.promisify(crypto.randomBytes);

const tokenStore = new Store('auth:token', 60 * 60 * 24 * 100); // Expire in 100 days
const authCodeStore = new Store('auth:authCode', 60 * 60 * 24 * 10); // Expire in 10 days

const authenticate = async token => tokenStore.get(token);

const login = async userId => {
  const token = await randomBytes(64).toString('hex');
  await tokenStore.set(token, userId);
  return token;
};

const exchangeAuthCode = async (userId, authCode) => {
  const foundUserId = await authCodeStore.get(authCode);
  if (foundUserId && foundUserId === userId) {
    return login(userId);
  }
  return null;
};

module.exports = {
  authenticate,
  login,
  exchangeAuthCode,
};
