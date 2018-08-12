import { combineReducers } from 'redux';

import {
  AUTH_TEST_FAILURE,
  AUTH_TEST_SUCCESS,
  AUTH_TEST_REQUEST,
  AUTH_SET_TOKEN,
} from '../types';

const isWaiting = (state = true, action) => {
  switch (action.type) {
    case AUTH_TEST_REQUEST:
      return true;
    case AUTH_TEST_FAILURE:
    case AUTH_TEST_SUCCESS:
      return false;
    default:
      return state;
  }
};

const token = (state = null, action) => {
  switch (action.type) {
    case AUTH_SET_TOKEN:
      return action.payload.token;
    default:
      return state;
  }
};

const isAuthed = (state = false, action) => {
  switch (action.type) {
    case AUTH_TEST_SUCCESS:
      return true;
    case AUTH_TEST_FAILURE:
      return false;
    default:
      return state;
  }
};

export default combineReducers({ isWaiting, token, isAuthed });
