const { APIError } = require('./errors');
const { ProductUser, Product } = require('../../models');

const requireAuth = async (ctx, next) => {
  const { user } = ctx.state;
  if (!user) {
    throw new APIError('no_auth');
  }
  await next();
};

const requirePM = async (ctx, next) => {
  const { productUser } = ctx.state;
  if (!productUser) {
    throw new Error('productUser missing from state');
  }

  if (!productUser.isPM) {
    throw new APIError('invalid_auth');
  }
  await next();
};

const requireAdmin = async (ctx, next) => {
  const { productUser } = ctx.state;
  if (!productUser) {
    throw new Error('productUser missing from state');
  }

  if (!productUser.isAdmin) {
    throw new APIError('invalid_auth');
  }
  await next();
};

const findProduct = async (ctx, next) => {
  const { productId } = ctx.request.body;
  const { user } = ctx.state;
  const product = await Product.findById(productId, {
    include: [
      {
        model: ProductUser,
        as: 'productUsers',
        required: true,
        where: { userId: user.id },
      },
    ],
  });
  if (!product) {
    throw new APIError('product_not_found');
  }
  const [productUser] = product.productUsers;
  ctx.state.product = product;
  ctx.state.productUser = productUser;
  await next();
};

module.exports = { requireAuth, requirePM, requireAdmin, findProduct };
