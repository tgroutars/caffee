import queryString from 'query-string';
import omit from 'lodash/omit';
import { push } from 'connected-react-router';

import {
  AUTH_TEST_FAILURE,
  AUTH_TEST_SUCCESS,
  AUTH_TEST_REQUEST,
  AUTH_SET_TOKEN,
} from '../types';
import CaffeeAPI, { APIError } from '../lib/CaffeeAPI';

const authTestFailure = () => ({
  type: AUTH_TEST_FAILURE,
});

const authTestSuccess = () => ({
  type: AUTH_TEST_SUCCESS,
});

const authTestRequest = () => ({
  type: AUTH_TEST_REQUEST,
});

export const setToken = token => ({
  type: AUTH_SET_TOKEN,
  payload: { token },
});

export const testAuth = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  const caffeeAPI = new CaffeeAPI(token);
  await dispatch(authTestRequest());
  try {
    await caffeeAPI.auth.test();
    await dispatch(authTestSuccess());
  } catch (err) {
    await dispatch(authTestFailure());
  }
};

export const login = (userId, authCode) => async dispatch => {
  const caffeeAPI = new CaffeeAPI();
  try {
    const { token } = await caffeeAPI.auth.login({ authCode, userId });
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
