import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';
import { roadmapStages as roadmapStagesSchema } from '../schemas';

import { currentProductSelector } from './product';

const entitiesSelector = state => state.entities;

export const roadmapStagesSelector = createSelector(
  entitiesSelector,
  currentProductSelector,
  (entities, product) => {
    if (!product || !product.roadmapStages) {
      return [];
    }

    return denormalize(
      product.roadmapStages,
      roadmapStagesSchema,
      entities,
    ).sort((s1, s2) => (s1.position > s2.position ? 1 : -1));
  },
);
