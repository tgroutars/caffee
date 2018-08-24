const crypto = require('crypto');
const { URL } = require('url');
const Promise = require('bluebird');

const Store = require('./redis/Store');

const randomBytes = Promise.promisify(crypto.randomBytes);

const { WEB_BASE_URL } = process.env;

const tokenStore = new Store('auth:token', 60 * 60 * 24 * 100); // Expire in 100 days
const authCodeStore = new Store('auth:authCode', 60 * 60 * 24 * 10); // Expire in 10 days

const authenticate = async token => tokenStore.get(token);

const login = async userId => {
  const token = (await randomBytes(16)).toString('hex');
  await tokenStore.set(token, userId);
  return token;
};

const logout = async token => {
  await tokenStore.del(token);
};

const generateAuthCode = async userId => {
  const authCode = (await randomBytes(16)).toString('hex');
  await authCodeStore.set(authCode, userId);
  return authCode;
};

const exchangeAuthCode = async (userId, authCode) => {
  const foundUserId = await authCodeStore.get(authCode);
  if (foundUserId && foundUserId === userId) {
    return login(userId);
  }
  return null;
};

const getPasswordLessURL = async (userId, { path = '' } = {}) => {
  const url = new URL(path, WEB_BASE_URL);
  const authCode = await generateAuthCode(userId);
  url.searchParams.append('userId', userId);
  url.searchParams.append('authCode', authCode);
  return url.toString();
};

module.exports = {
  authenticate,
  login,
  logout,
  generateAuthCode,
  exchangeAuthCode,
  getPasswordLessURL,
};
