const { APIError } = require('./errors');
const { ProductUser, Product } = require('../../models');

const requireAuth = async (ctx, next) => {
  const { user } = ctx.state;
  if (!user) {
    throw new APIError('no_auth');
  }
  await next();
};

const requireAdmin = async (ctx, next) => {
  const { product, user } = ctx.state;
  if (!product) {
    throw new Error('product missing from state');
  }
  if (!user) {
    throw new Error('user missing from state');
  }
  const productUser = await ProductUser.find({
    where: {
      role: 'admin',
      userId: user.id,
      productId: product.id,
    },
  });
  if (!productUser) {
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
        where: {
          userId: user.id,
          role: 'admin',
        },
      },
    ],
  });
  if (!product) {
    throw new APIError('product_not_found');
  }
  ctx.state.product = product;
  await next();
};

module.exports = { requireAuth, requireAdmin, findProduct };
