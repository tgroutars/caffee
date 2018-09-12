import api from './api';
import { addEntities } from './entities';

export const listActivities = productId => async dispatch => {
  const { activities } = await dispatch(api.activities.list({ productId }));
  await dispatch(addEntities('product', { id: productId, activities }));
  return activities;
};
