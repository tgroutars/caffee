import { createSelector } from 'reselect';

import { currentProductSelector } from './product';

const scopesSelector = state => state.entities.scopes;
const currentComponentIdsSelector = createSelector(
  currentProductSelector,
  product => product.scopes || [],
);

export const currentComponentsSelector = createSelector(
  currentComponentIdsSelector,
  scopesSelector,
  (scopeIds, scopes) =>
    scopeIds.map(scopeId => scopes[scopeId]).sort((s1, s2) => {
      if (s1.level === s2.level) {
        if (s1.createdAt < s2.createdAt) {
          return -1;
        }
        return 1;
      }
      return s1.level - s2.level;
    }),
);

export const scopesTreeSelector = createSelector(
  currentComponentsSelector,
  scopes => {
    const map = {};
    const roots = [];
    scopes.forEach(scope => {
      map[scope.id] = scope;
      scope.subscopes = [];
    });
    scopes.forEach(scope => {
      if (scope.parentId) {
        map[scope.parentId].subscopes.push(scope);
      } else {
        roots.push(scope);
      }
    });
    return roots;
  },
);
