const Router = require('koa-router');

const { getAccessToken } = require('../../integrations/trello/helpers/auth');
const { Product: ProductService } = require('../../services');

const router = new Router();

router.get('/install/callback', async ctx => {
  const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = ctx.query;

  if (!oauthToken || !oauthVerifier) {
    ctx.redirect('/apps');
    return;
  }

  const {
    accessToken,
    accessTokenSecret,
    productId,
    returnTo,
    userId,
    workspaceId,
  } = await getAccessToken(oauthToken, oauthVerifier);

  await ProductService.setTrelloTokens(productId, {
    accessToken,
    accessTokenSecret,
    installer: {
      userId,
      workspaceId,
    },
  });

  await ctx.redirect(returnTo);
});

module.exports = router;
