const Router = require('koa-router');
const axios = require('axios');
const querystring = require('querystring');
const SlackClient = require('@slack/client').WebClient;

const {
  Product: ProductService,
  SlackInstall: SlackInstallService,
  SlackUser: SlackUserService,
  SlackWorkspace: SlackWorkspaceService,
} = require('../../../services');
const { getUserVals } = require('../../../integrations/slack/helpers/user');

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
const REDIRECT_URI = `${BASE_URL}/integrations/slack/auth/install/callback`;

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
    authorizing_user: { user_id: slackUserId, app_home: appHome },
    app_user_id: appUserId,
    app_id: appId,
  } = access;

  const slackClient = new SlackClient(accessToken);
  const { user: userInfo } = await slackClient.users.info({
    user: slackUserId,
  });
  const { team: workspaceInfo } = await slackClient.team.info();
  const {
    id: workspaceSlackId,
    name: workspaceName,
    icon: { image_132: workspaceImage },
    domain,
  } = workspaceInfo;

  const [workspace] = await SlackWorkspaceService.findOrCreate({
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

  await product.addUser(user, { through: { role: 'admin' } });

  await SlackInstallService.create({
    productId: product.id,
    workspaceId: workspace.id,
  });

  ctx.redirect(`https://slack.com/app_redirect?channel=${appHome}`);
});

module.exports = router;
