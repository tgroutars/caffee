import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';

import { ADD_ENTITIES } from '../types';

const initialState = {
  users: {},
  products: {},
  scopes: {},
  feedbacks: {},
  slackInstalls: {},
  roadmapStages: {},
  tags: {},
};

const entities = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ENTITIES:
      return mergeWith(
        {},
        state,
        action.payload.entities,
        (objValue, srcValue) => {
          if (isArray(objValue)) {
            return srcValue;
          }
          return undefined;
        },
      );
    default:
      return state;
  }
};

export default entities;
