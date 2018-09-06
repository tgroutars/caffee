import api from './api';
import { addEntities } from './entities';

export const listProductUsers = productId => async dispatch => {
  const { users } = await dispatch(api.products.users.list({ productId }));
  dispatch(addEntities('product', { id: productId, users }));
};
