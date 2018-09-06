import { createSelector } from 'reselect';
import uuidv4 from 'uuid/v4';
import cloneDeep from 'lodash/cloneDeep';

import { currentProductSelector } from './product';

export const currentScopesSelector = createSelector(
  currentProductSelector,
  product =>
    (product.scopes || []).filter(scope => !scope.isArchived).sort((s1, s2) => {
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
  currentScopesSelector,
  entitiesScopes => {
    const scopes = cloneDeep(entitiesScopes);
    const map = {};
    const roots = [];
    scopes.forEach(scope => {
      map[scope.id] = scope;
      scope.subscopes = [];
    });
    scopes.forEach(scope => {
      if (scope.parentId) {
        const parent = map[scope.parentId];
        if (parent) {
          parent.subscopes.push(scope);
        }
      } else {
        roots.push(scope);
      }
    });
    roots.push({
      id: null,
      cid: uuidv4(),
      name: '',
      level: 0,
      subscopes: [],
      parentId: null,
    });
    scopes.forEach(scope => {
      if (scope.level < 1) {
        scope.subscopes.push({
          id: null,
          cid: uuidv4(),
          name: '',
          level: scope.level + 1,
          subscopes: [],
          parentId: scope.id,
        });
      }
    });
    return roots;
  },
);
