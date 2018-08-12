const { APIError } = require('./errors');

const requireAuth = async (ctx, next) => {
  const { user } = ctx.state;
  if (!user) {
    throw new APIError('no_auth');
  }
  await next();
};

module.exports = { requireAuth };
