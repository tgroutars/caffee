import { combineReducers } from 'redux';

import { PRODUCT_SET_PRODUCT_ID, PRODUCT_FETCH_SUCCESS } from '../types';

const productId = (state = null, action) => {
  switch (action.type) {
    case PRODUCT_SET_PRODUCT_ID:
      return action.payload.productId;
    default:
      return state;
  }
};

const isWaiting = (state = true, action) => {
  switch (action.type) {
    case PRODUCT_SET_PRODUCT_ID:
      return true;
    case PRODUCT_FETCH_SUCCESS:
      return false;
    default:
      return state;
  }
};

export default combineReducers({ isWaiting, productId });
