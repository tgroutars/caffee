import api from './api';
import { addEntities } from './entities';
import { PRODUCT_SET_PRODUCT_IDS, PRODUCT_SET_PRODUCT_ID } from '../types';

const setProductIds = productIds => ({
  type: PRODUCT_SET_PRODUCT_IDS,
  payload: { productIds },
});

const setProductId = productId => ({
  type: PRODUCT_SET_PRODUCT_ID,
  payload: { productId },
});

export const listProducts = () => async dispatch => {
  const { products } = await dispatch(api.products.list());
  dispatch(addEntities('products', products));
  dispatch(setProductIds(products.map(product => product.id)));
};

export const fetchProduct = productId => async dispatch => {
  const { product } = await dispatch(api.products.info({ productId }));
  dispatch(addEntities('product', product));
  dispatch(setProductId(product.id));
};

export const changeCurrentProduct = productId => async (dispatch, getState) => {
  dispatch(setProductId(productId));
  const { product } = await dispatch(api.products.info({ productId }));
  const { productId: currentProductId } = getState().product;
  if (product.id !== currentProductId) {
    return;
  }
  dispatch(addEntities('product', product));
};

// //
// const setProductId = productId => ({
//   type: PRODUCT_SET_PRODUCT_ID,
//   payload: { productId },
// });
//
// const fetch = () => ({
//   type: PRODUCT_FETCH_PRODUCT,
// });
// const fetchSuccess = () => ({
//   type: PRODUCT_FETCH_PRODUCT_SUCCESS,
// });
//

//
// export const saveQuestions = (productId, questions) => async dispatch => {
//   const { product } = await dispatch(
//     api.products.setQuestions({ productId, questions }),
//   );
//   await dispatch(addEntities('product', product));
// };
//
// export const listProducts = () => async dispatch => {
//   // dispatch();
// };
