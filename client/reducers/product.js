import { combineReducers } from 'redux';

import { PRODUCT_SET_PRODUCT_IDS } from '../types';

const productIds = (state = [], action) => {
  switch (action.type) {
    case PRODUCT_SET_PRODUCT_IDS:
      return action.payload.productIds;
    default:
      return state;
  }
};

export default combineReducers({ productIds });
