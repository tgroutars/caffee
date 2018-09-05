import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { tags as tagsSchema } from '../schemas';

import { currentProductSelector } from './product';

const entitiesSelector = state => state.entities;

export const tagsSelector = createSelector(
  entitiesSelector,
  currentProductSelector,
  (entities, product) => {
    if (!product || !product.tags) {
      return [];
    }

    return denormalize(product.tags, tagsSchema, entities);
  },
);
