import { createSelector } from 'reselect';

const currentProductIdSelector = state => state.product.productId;
const productIdsSelector = state => state.product.productIds;
const productMapSelector = state => state.entities.products;

const isPM = product =>
  product.userRole === 'admin' || product.userRole === 'user';

export const productsSelector = createSelector(
  productIdsSelector,
  productMapSelector,
  (productIds, productMap) =>
    productIds.map(productId => productMap[productId]).filter(isPM),
);

export const currentProductSelector = createSelector(
  currentProductIdSelector,
  productMapSelector,
  (productId, products) => (productId ? products[productId] : null),
);
