const Router = require('koa-router');
const axios = require('axios');
const querystring = require('querystring');
const SlackClient = require('@slack/client').WebClient;
const Promise = require('bluebird');
const moment = require('moment');

const { getUserVals } = require('../../integrations/slack/helpers/user');
const { Product, SlackWorkspace } = require('../../models');
const {
  Product: ProductService,
  SlackWorkspace: SlackWorkspaceService,
  SlackUser: SlackUserService,
  SlackInstall: SlackInstallService,
} = require('../../services');

const SCOPES = [
  'channels:history',
  'chat:write',
  'conversations:history',
  'conversations:read',
  'conversations:write',
  'conversations.app_home:create',
  'groups:history',
  'commands',
  'users:read',
  'users:read.email',
  'users.profile:read',
  'files:read',
  'files:write',
  'team:read',
];
const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, BASE_URL } = process.env;
const AUTHORIZATION_URL = `https://slack.com/oauth/authorize`;
const ACCESS_URL = 'https://slack.com/api/oauth.access';
const REDIRECT_URI = `${BASE_URL}/auth/slack/install/callback`;
const AUTHORIZE_REDIRECT_URI = `${BASE_URL}/auth/slack/authorize/callback`;

const router = new Router();

router.get('/authorize', async ctx => {
  const queryParams = {
    scope: SCOPES.join(','),
    redirect_uri: AUTHORIZE_REDIRECT_URI,
    client_id: SLACK_CLIENT_ID,
    single_channel: false,
  };
  const query = querystring.stringify(queryParams);
  const authorizeURL = `${AUTHORIZATION_URL}?${query}`;
  ctx.redirect(authorizeURL);
});

router.get('/authorize/callback', async ctx => {
  const { code } = ctx.query;
  const { data: access } = await axios.get(ACCESS_URL, {
    params: {
      code,
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      redirect_uri: AUTHORIZE_REDIRECT_URI,
    },
  });

  if (!access.ok) {
    ctx.throw(401);
  }

  const {
    refresh_token: refreshToken,
    access_token: accessToken,
    expires_in: tokenExpiresIn,
    team_id: workspaceSlackId,
    authorizing_user: { app_home: appHome },
  } = access;
  const tokenExpiresAt = moment().add(tokenExpiresIn, 'seconds');

  await SlackWorkspace.update(
    { refreshToken, tokenExpiresAt, accessToken },
    { where: { slackId: workspaceSlackId } },
  );

  ctx.redirect(`https://slack.com/app_redirect?channel=${appHome}`);
});

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
    refresh_token: refreshToken,
    expires_in: tokenExpiresIn,
  } = access;
  const tokenExpiresAt = moment().add(tokenExpiresIn, 'seconds');

  const slackClient = new SlackClient(accessToken);
  const [{ user: userInfo }, { team: workspaceInfo }] = await Promise.all([
    slackClient.users.info({
      user: userSlackId,
    }),
    slackClient.team.info(),
  ]);

  const {
    id: workspaceSlackId,
    name: workspaceName,
    icon: { image_132: workspaceImage },
    domain,
  } = workspaceInfo;
  const [workspace] = await SlackWorkspaceService.findOrCreate({
    refreshToken,
    tokenExpiresAt,
    accessToken,
    domain,
    appId,
    appUserId,
    slackId: workspaceSlackId,
    name: workspaceName,
    image: workspaceImage,
  });

  const userVals = getUserVals(userInfo);
  const [slackUser] = await SlackUserService.findOrCreate({
    ...userVals,
    workspaceId: workspace.id,
  });
  const { user } = slackUser;
  const product = await ProductService.create({
    name: workspaceName,
    image: workspaceImage,
    ownerId: user.id,
  });
  await SlackInstallService.create({
    productId: product.id,
    workspaceId: workspace.id,
  });
  await ProductService.doOnboarding(product.id, {
    onboardingStep: Product.ONBOARDING_STEPS['01_CHOOSE_PRODUCT_NAME'],
    slackUserId: slackUser.id,
  });

  ctx.redirect(`https://slack.com/app_redirect?channel=${appHome}`);
});

module.exports = router;
