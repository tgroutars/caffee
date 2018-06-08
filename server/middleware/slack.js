const Boom = require('boom');

const { SLACK_VERIFICATION_TOKEN } = process.env;

const verifyToken = async (ctx, next) => {
  const { token } = ctx.request.body;
  if (token !== SLACK_VERIFICATION_TOKEN) {
    throw Boom.unauthorized();
  }
  await next();
};

module.exports = { verifyToken };
