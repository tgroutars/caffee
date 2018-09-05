import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import { user as userSchema } from '../schemas';
import { currentProductSelector } from './product';

const entitiesSelector = state => state.entities;
export const authedUserIdSelector = state => state.auth.authedUserId;

export const authedUserSelector = createSelector(
  authedUserIdSelector,
  entitiesSelector,
  (authedUserId, entities) => denormalize(authedUserId, userSchema, entities),
);

export const productUsersSelector = createSelector(
  currentProductSelector,
  product => product.users || [],
);
