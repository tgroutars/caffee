import api from './api';
import { addEntities } from './entities';

export const fetchScopes = productId => async (dispatch, getState) => {
  const { scopes } = await dispatch(api.scopes.list({ productId }));
  const { productId: currentProductId } = getState().product;
  if (productId !== currentProductId) {
    return;
  }
  dispatch(addEntities('product', { id: productId, scopes }));
};
