const { Product } = require('../../../../../models');
const { openDialog } = require('../../../dialogs');

const openProductNameDialog = openDialog('product_name');

module.exports = async (payload, { workspace }) => {
  const { trigger_id: triggerId, action } = payload;

  const { productId } = action.name;
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
