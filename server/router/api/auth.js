const Router = require('koa-router');

const { APIError } = require('./errors');
const { exchangeAuthCode, getPasswordLessURL } = require('../../lib/auth');
const { requireAuth } = require('./middleware');
const { Sequelize, User } = require('../../models');
const { sendMail } = require('../../lib/mail');

const { Validator } = Sequelize;

const router = new Router();

router.post('/auth.test', requireAuth, async ctx => {
  ctx.send({ userId: ctx.state.user.id });
});

router.post('/auth.login', async ctx => {
  const { userId, authCode } = ctx.request.body;
  const token = await exchangeAuthCode(userId, authCode);
  if (!token) {
    throw new APIError('invalid_auth');
  }
  ctx.send({ token });
});

router.post('/auth.sendPasswordlessLink', async ctx => {
  const { email } = ctx.request.body;
  const isEmail = Validator.isEmail(email);
  if (!isEmail) {
    throw new APIError('invalid_email');
  }
  const user = await User.find({ where: { email } });
  if (!user) {
    throw new APIError('user_not_found');
  }
  const passwordlessLink = await getPasswordLessURL(user.id);
  await sendMail(
    'magic_link',
    {
      passwordlessLink,
      userName: user.name,
    },
    {
      to: user.email,
      from: 'caffee@caffee.io',
      subject: 'Your magic link to Caffee',
    },
  );
  ctx.send();
});

module.exports = router;
