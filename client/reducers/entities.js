import merge from 'lodash/merge';

import { ADD_ENTITIES } from '../types';

const initialState = {
  users: {},
  products: {},
};

const entities = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ENTITIES:
      return merge({}, state, action.payload.entities);
    default:
      return state;
  }
};

export default entities;
