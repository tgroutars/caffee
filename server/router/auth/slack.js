const Router = require('koa-router');
const axios = require('axios');
const querystring = require('querystring');

const { Product: ProductService } = require('../../services');

const SCOPES = [
  'channels:history',
  'channels:read',
  'chat:write',
  'commands',
  'files:read',
  'groups:read',
  'reactions:read',
  'reactions:write',
  'team:read',
  'users:read.email',
  'users:read',
  'users.profile:read',
];
const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, BASE_URL } = process.env;
const AUTHORIZATION_URL = `https://slack.com/oauth/authorize`;
const ACCESS_URL = 'https://slack.com/api/oauth.access';
const REDIRECT_URI = `${BASE_URL}/auth/slack/install/callback`;

const router = new Router();

router.get('/install', async ctx => {
  const queryParams = {
    scope: SCOPES.join(','),
    redirect_uri: REDIRECT_URI,
    client_id: SLACK_CLIENT_ID,
    single_channel: false,
  };
  const query = querystring.stringify(queryParams);
  const installURL = `${AUTHORIZATION_URL}?${query}`;
  ctx.redirect(installURL);
});

router.get('/install/callback', async ctx => {
  const { code } = ctx.query;
  const { data: access } = await axios.get(ACCESS_URL, {
    params: {
      code,
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
    },
  });
  if (!access.ok) {
    ctx.throw(401);
  }

  const {
    access_token: accessToken,
    authorizing_user: { user_id: userSlackId, app_home: appHome },
    app_user_id: appUserId,
    app_id: appId,
  } = access;

  await ProductService.createFromSlackInstall({
    accessToken,
    userSlackId,
    appId,
    appUserId,
  });

  ctx.redirect(`https://slack.com/app_redirect?channel=${appHome}`);
});

module.exports = router;
