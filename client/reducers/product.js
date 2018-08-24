import { combineReducers } from 'redux';

import { PRODUCT_SET_PRODUCT_IDS, PRODUCT_SET_PRODUCT_ID } from '../types';

const productIds = (state = [], action) => {
  switch (action.type) {
    case PRODUCT_SET_PRODUCT_IDS:
      return action.payload.productIds;
    default:
      return state;
  }
};

const productId = (state = null, action) => {
  switch (action.type) {
    case PRODUCT_SET_PRODUCT_ID:
      return action.payload.productId;
    default:
      return state;
  }
};

export default combineReducers({ productIds, productId });
