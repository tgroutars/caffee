import { createSelector } from 'reselect';
import { matchPath } from 'react-router-dom';
import { denormalize } from 'normalizr';

import {
  product as productSchema,
  products as productsSchema,
} from '../schemas';

const currentPathnameSelector = state => state.router.location.pathname;
export const currentProductIdSelector = createSelector(
  currentPathnameSelector,
  pathname => {
    const match = matchPath(pathname, '/manage/:productId');
    if (!match) {
      return null;
    }
    return match.params.productId;
  },
);
export const productIdsSelector = state => state.product.productIds;
const entitiesSelector = state => state.entities;

const isPM = product =>
  product.userRole === 'admin' || product.userRole === 'user';

const isAdmin = product => product.userRole === 'admin';

export const productsSelector = createSelector(
  productIdsSelector,
  entitiesSelector,
  (productIds, entities) =>
    denormalize(productIds, productsSchema, entities).filter(isPM),
);

export const currentProductSelector = createSelector(
  currentProductIdSelector,
  entitiesSelector,
  (productId, entities) => denormalize(productId, productSchema, entities),
);

export const isCurrentProductAdminSelector = createSelector(
  currentProductSelector,
  product => {
    if (!product) {
      return false;
    }
    return isAdmin(product);
  },
);
