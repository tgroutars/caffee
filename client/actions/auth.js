import queryString from 'query-string';
import omit from 'lodash/omit';
import { push } from 'connected-react-router';

import api, { APIError } from './api';
import { addEntities } from './entities';
import { AUTH_SET_TOKEN, AUTH_SUCCESS, AUTH_FAILURE } from '../types';

const setToken = token => ({
  type: AUTH_SET_TOKEN,
  payload: { token },
});

const fetchAuthedUser = () => async dispatch => {
  const { user } = await dispatch(api.users.me());
  dispatch(addEntities('user', user));
};

const authSuccess = userId => ({
  type: AUTH_SUCCESS,
  payload: { userId },
});

const authFailure = () => async dispatch => {
  localStorage.removeItem('token', null);
  dispatch({
    type: AUTH_FAILURE,
  });
};

const testAuth = () => async dispatch => {
  try {
    const { userId } = await dispatch(api.auth.test());
    await dispatch(authSuccess(userId));
    await dispatch(fetchAuthedUser());
  } catch (err) {
    if (err instanceof APIError && err.error === 'no_auth') {
      await dispatch(authFailure());
      return;
    }
    throw err;
  }
};

const login = (userId, authCode) => async dispatch => {
  try {
    const { token } = await dispatch(api.auth.login({ authCode, userId }));
    localStorage.setItem('token', token);
    await dispatch(setToken(token));
    await dispatch(testAuth());
  } catch (err) {
    if (err instanceof APIError) {
      return;
    }
    throw err;
  }
};

export const checkAuth = () => async (dispatch, getState) => {
  const { location } = getState().router;
  const query = queryString.parse(location.search);
  const { authCode, userId } = query;
  if (userId && authCode) {
    await dispatch(login(userId, authCode));
    const newQuery = omit(query, ['userId', 'authCode']);
    await dispatch(
      push({
        ...location,
        search: `?${queryString.stringify(newQuery)}`,
      }),
    );
    return;
  }
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    await dispatch(setToken(storedToken));
  }
  await dispatch(testAuth());
};
