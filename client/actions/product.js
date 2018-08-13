import api from './api';
import { addEntities } from './entities';
import { PRODUCT_SET_PRODUCT_ID, PRODUCT_FETCH_SUCCESS } from '../types';

const setProductId = productId => ({
  type: PRODUCT_SET_PRODUCT_ID,
  payload: { productId },
});

const fetchSuccess = () => ({
  type: PRODUCT_FETCH_SUCCESS,
});

export const changeCurrentProduct = productId => async (dispatch, getState) => {
  dispatch(setProductId(productId));
  const { product } = await dispatch(api.products.info({ productId }));
  const { productId: currentProductId } = getState().product;
  if (product.id !== currentProductId) {
    return;
  }
  dispatch(addEntities('product', product));
  dispatch(fetchSuccess(product));
};

export const saveQuestions = (productId, questions) => async dispatch => {
  const { product } = await dispatch(
    api.products.setQuestions({ productId, questions }),
  );
  await dispatch(addEntities('product', product));
};
