import { createSelector } from 'reselect';

const authedUserIdSelector = state => state.auth.authedUserId;
const usersSelector = state => state.entities.users;

export const authedUserSelector = createSelector(
  authedUserIdSelector,
  usersSelector,
  (authedUserId, users) => (authedUserId ? users[authedUserId] : null),
);
