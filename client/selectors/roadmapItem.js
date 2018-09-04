import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { roadmapItems as roadmapItemsSchema } from '../schemas';

import { currentProductSelector } from './product';

const entitiesSelector = state => state.entities;

export const roadmapItemsSelector = createSelector(
  entitiesSelector,
  currentProductSelector,
  (entities, product) => {
    if (!product || !product.roadmapItems) {
      return [];
    }

    return denormalize(product.roadmapItems, roadmapItemsSchema, entities).sort(
      (i1, i2) => (i1.createdAt > i2.createdAt ? 1 : -1),
    );
  },
);
