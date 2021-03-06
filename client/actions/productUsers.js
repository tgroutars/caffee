import api from './api';
import { addEntities } from './entities';
import { productUsersSelector } from '../selectors/user';

export const listProductUsers = productId => async dispatch => {
  const { users } = await dispatch(api.products.users.list({ productId }));
  dispatch(addEntities('product', { id: productId, users }));
  return users;
};

export const getSuggestedUsers = productId => async dispatch => {
  const { users } = await dispatch(
    api.products.users.getSuggestions({ productId }),
  );
  return users;
};

export const addUser = (productId, userId) => async (dispatch, getState) => {
  const { user: newUser } = await dispatch(
    api.products.users.add({ productId, userId }),
  );
  const productUsers = productUsersSelector(getState());
  const users = [...productUsers.map(user => user.id), newUser.id];
  dispatch(addEntities('user', newUser));
  dispatch(addEntities('product', { id: productId, users }));
  return newUser;
};

export const removeUser = (productId, userId) => async (dispatch, getState) => {
  await dispatch(api.products.users.remove({ productId, userId }));
  const users = productUsersSelector(getState()).filter(
    user => user.id !== userId,
  );
  dispatch(addEntities('product', { id: productId, users }));
};

export const setRole = (productId, userId, role) => async dispatch => {
  const { user } = await dispatch(
    api.products.users.setRole({ productId, userId, role }),
  );
  dispatch(addEntities('user', user));
  return user;
};
