import { combineReducers } from 'redux';

import auth from './auth';
import product from './product';
import entities from './entities';
import { LOGOUT_SUCCESS } from '../types';

const appReducer = combineReducers({
  auth,
  product,
  entities,
});

export default (state, action) => {
  if (action.type === LOGOUT_SUCCESS) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
