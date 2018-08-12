import axios from 'axios';

const apiRequest = (method, params) => ({
  type: `API_REQUEST:${method}`,
  payload: { params },
});
const apiSuccess = (method, params, result) => ({
  type: `API_SUCCESS:${method}`,
  payload: { params, result },
});
const apiFailure = (method, params) => ({
  type: `API_FAILURE:${method}`,
  payload: { params },
});

export class APIError extends Error {
  constructor(error) {
    super();
    this.error = error;
  }
}

export const apiCall = (method, params = {}) => async (dispatch, getState) => {
  const headers = {};
  const { token } = getState().auth;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const baseURL = process.env.BASE_URL;
  dispatch(apiRequest(method, params));
  const response = await axios.post(`/api/${method}`, params, {
    headers,
    baseURL,
  });
  const { ok, payload, error } = response.data;
  if (!ok) {
    dispatch(apiFailure(method, params));
    throw new APIError(error);
  }
  dispatch(apiSuccess(method, params, payload));
  return payload;
};

export const makeMethod = method => params => async (dispatch, getState) =>
  apiCall(method, params)(dispatch, getState);

export default {
  auth: {
    test: apiCall.bind(this, 'auth.test'),
    login: apiCall.bind(this, 'auth.login'),
  },
  users: {
    me: makeMethod('users.me'),
  },
};
