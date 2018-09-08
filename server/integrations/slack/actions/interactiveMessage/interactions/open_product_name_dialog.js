const { Product, ProductUser } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');
const { SlackPermissionError } = require('../../../../../lib/errors');

const openProductNameDialog = openDialog('product_name');

module.exports = async (payload, { workspace, user }) => {
  const { trigger_id: triggerId, action } = payload;

  const { productId } = action.name;

  const productUser = await ProductUser.find({
    where: { productId, userId: user.id },
  });
  if (!productUser || !productUser.isAdmin) {
    throw new SlackPermissionError();
  }

  const product = await Product.findById(productId);

  const { accessToken } = workspace;

  await openProductNameDialog({
    productId,
    productName: product.name,
  })({
    accessToken,
    triggerId,
  });
};
