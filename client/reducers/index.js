import { combineReducers } from 'redux';

import auth from './auth';
import entities from './entities';

export default combineReducers({
  auth,
  entities,
});
