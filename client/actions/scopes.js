import api from './api';
import { addEntities } from './entities';
import { currentScopesSelector } from '../selectors/scope';

export const fetchScopes = productId => async (dispatch, getState) => {
  const { scopes } = await dispatch(api.scopes.list({ productId }));
  const { productId: currentProductId } = getState().product;
  if (productId !== currentProductId) {
    return;
  }
  dispatch(addEntities('product', { id: productId, scopes }));
};

export const saveName = (scopeId, name) => async dispatch => {
  const { scope } = await dispatch(api.scopes.setName({ scopeId, name }));
  dispatch(addEntities('scope', scope));
};

export const createScope = ({ productId, parentId, name }) => async (
  dispatch,
  getState,
) => {
  const { scope } = await dispatch(
    api.scopes.create({ productId, parentId, name }),
  );
  dispatch(addEntities('scope', scope));
  const scopeIds = currentScopesSelector(getState()).map(({ id }) => id);
  dispatch(
    addEntities('product', { id: productId, scopes: [...scopeIds, scope.id] }),
  );
};

const archiveRecursive = scope => dispatch => {
  if (!scope.id) {
    return;
  }
  dispatch(
    addEntities('scope', {
      ...scope,
      isArchived: true,
    }),
  );
  scope.subscopes.forEach(subscope => dispatch(archiveRecursive(subscope)));
};

export const archiveScope = scopeId => async (dispatch, getState) => {
  const { scope } = await dispatch(api.scopes.archive({ scopeId, name }));
  dispatch(addEntities('scope', scope));
  const scopeEntity = getState().entities.scopes[scope.id];
  dispatch(archiveRecursive(scopeEntity));
};
