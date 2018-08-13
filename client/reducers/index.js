import { combineReducers } from 'redux';

import auth from './auth';
import product from './product';
import entities from './entities';

export default combineReducers({
  auth,
  product,
  entities,
});
