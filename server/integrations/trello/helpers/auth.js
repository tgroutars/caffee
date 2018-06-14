const querystring = require('querystring');
const { OAuth } = require('oauth');
const Promise = require('bluebird');

const Store = require('../../../lib/redis/Store');

const REQUEST_URL = 'https://trello.com/1/OAuthGetRequestToken';
const ACCESS_URL = 'https://trello.com/1/OAuthGetAccessToken';
const AUTHORIZE_URL = 'https://trello.com/1/OAuthAuthorizeToken';
const APP_NAME = 'Caffee';
const SCOPE = 'read,write';
const EXPIRATION = 'never';
const { TRELLO_API_KEY, TRELLO_API_SECRET, BASE_URL } = process.env;

const CALLBACK_URL = `${BASE_URL}/integrations/trello/auth/install/callback`;

const oauth = new OAuth(
  REQUEST_URL,
  ACCESS_URL,
  TRELLO_API_KEY,
  TRELLO_API_SECRET,
  '1.0A',
  CALLBACK_URL,
  'HMAC-SHA1',
);

const tokenStore = new Store('trello:oauth:token', 60 * 10);
const stateStore = new Store('trello:oauth:state', 60 * 10);

const getInstallURL = async (productId, { returnTo } = {}) =>
  new Promise((resolve, reject) => {
    oauth.getOAuthRequestToken(async (err, token, tokenSecret) => {
      if (err) {
        reject(err);
        return;
      }
      await tokenStore.set(token, tokenSecret);
      await stateStore.set(token, { productId, returnTo });
      const query = querystring.stringify({
        name: APP_NAME,
        oauth_token: token,
        expiration: EXPIRATION,
        scope: SCOPE,
      });
      resolve(`${AUTHORIZE_URL}?${query}`);
    });
  });

const getAccessToken = async (token, verifier) => {
  const tokenSecret = await tokenStore.get(token);
  const { productId, returnTo } = await stateStore.get(token);
  return new Promise((resolve, reject) => {
    oauth.getOAuthAccessToken(
      token,
      tokenSecret,
      verifier,
      (accessError, accessToken, accessTokenSecret) => {
        if (accessError) {
          reject(new Error());
          return;
        }
        resolve({
          accessToken,
          accessTokenSecret,
          productId,
          returnTo,
        });
      },
    );
  });
};

module.exports = { getInstallURL, getAccessToken };
