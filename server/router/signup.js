const Router = require('koa-router');
const winston = require('winston');
const Promise = require('bluebird');
const trim = require('lodash/trim');

const { sendMail } = require('../lib/mail');
const Hubspot = require('../lib/Hubspot');

const router = new Router();

const sendNotifyEmail = async email => {
  await sendMail(
    'new_signup',
    { email },
    {
      to: 'thomas@caffee.io',
      from: email,
      subject: 'New signup on Caffee',
    },
  );
};

const createContact = async email => {
  try {
    await Hubspot.createContact(email);
  } catch (err) {
    winston.error(err);
  }
};

const sendFollowupEmail = async email => {
  await sendMail(
    'welcome',
    {},
    {
      to: email,
      from: 'Thomas from Caffee <thomas@caffee.io>',
      subject: 'Welcome to Caffee! 🤗',
    },
  );
};

router.options('*', async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': 'https://caffee.io',
  });
  await next();
});
router.use(async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': 'https://caffee.io',
  });
  await next();
});

router.post('/', async ctx => {
  const email = trim(ctx.request.body.email);

  await Promise.all([
    sendNotifyEmail(email),
    createContact(email),
    sendFollowupEmail(email),
  ]);

  ctx.body = null;
});

module.exports = router;
