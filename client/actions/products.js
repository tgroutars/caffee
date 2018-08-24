import api from './api';
import { addEntities } from './entities';
import { PRODUCT_SET_PRODUCT_IDS } from '../types';

const setProductIds = productIds => ({
  type: PRODUCT_SET_PRODUCT_IDS,
  payload: { productIds },
});

export const listProducts = () => async dispatch => {
  const { products } = await dispatch(api.products.list());
  dispatch(addEntities('products', products));
  dispatch(setProductIds(products.map(product => product.id)));
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
// export const changeCurrentProduct = productId => async (dispatch, getState) => {
//   dispatch(setProductId(productId));
//   dispatch(fetch());
//   const { product } = await dispatch(api.products.info({ productId }));
//   const { productId: currentProductId } = getState().product;
//   if (product.id !== currentProductId) {
//     return;
//   }
//   dispatch(addEntities('product', product));
//   dispatch(fetchSuccess(product));
// };
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
