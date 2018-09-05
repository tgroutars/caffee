import api from './api';
import { addEntities } from './entities';

export const listProductUsers = productId => async dispatch => {
  const { users } = await dispatch(api.productUsers.list({ productId }));
  dispatch(addEntities('product', { id: productId, users }));
};
