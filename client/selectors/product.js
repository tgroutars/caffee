import { createSelector } from 'reselect';

const currentProductIdSelector = state => state.product.productId;
const productsSelector = state => state.entities.products;

export const currentProductSelector = createSelector(
  currentProductIdSelector,
  productsSelector,
  (productId, products) => (productId ? products[productId] : null),
);
