import { combineReducers } from 'redux';

import { AUTH_SET_TOKEN, AUTH_SUCCESS, AUTH_FAILURE } from '../types';

const isWaiting = (state = true, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
    case AUTH_FAILURE:
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
    case AUTH_SUCCESS:
      return true;
    case AUTH_FAILURE:
      return false;
    default:
      return state;
  }
};

const authedUserId = (state = null, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return action.payload.userId;
    case AUTH_FAILURE:
      return null;
    default:
      return state;
  }
};

export default combineReducers({ isWaiting, token, isAuthed, authedUserId });
