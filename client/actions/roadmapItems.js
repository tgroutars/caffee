import api from './api';
import { addEntities } from './entities';

export const listRoadmapItems = (
  productId,
  { includeArchived = false } = {},
) => async dispatch => {
  const { roadmapItems } = await dispatch(
    api.roadmapItems.list({
      productId,
      includeArchived,
    }),
  );
  dispatch(addEntities('product', { id: productId, roadmapItems }));
};
