/* eslint-disable import/prefer-default-export */
import { normalize } from 'normalizr';

import schemas from '../schemas';
import { ADD_ENTITIES } from '../types';

export const addEntities = (schemaKey, data) => {
  const schema = schemas[schemaKey];
  if (!schema) {
    throw new Error(`Unknown schema: ${schemaKey}`);
  }
  const { entities, result } = normalize(data, schema);
  return {
    type: ADD_ENTITIES,
    payload: { entities, result },
  };
};
