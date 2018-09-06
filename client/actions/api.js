import axios from 'axios';

const apiRequest = (method, params) => ({
  type: `API_REQUEST:${method}`,
  payload: { params },
});
const apiSuccess = (method, params, result) => ({
  type: `API_SUCCESS:${method}`,
  payload: { params, result },
});
const apiFailure = (method, params, error) => ({
  type: `API_FAILURE:${method}`,
  payload: { params, error },
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
    dispatch(apiFailure(method, params, error));
    throw new APIError(error);
  }
  dispatch(apiSuccess(method, params, payload));
  return payload;
};

export default {
  auth: {
    test: apiCall.bind(this, 'auth.test'),
    login: apiCall.bind(this, 'auth.login'),
    logout: apiCall.bind(this, 'auth.logout'),
    sendPasswordlessLink: apiCall.bind(this, 'auth.sendPasswordlessLink'),
  },
  users: {
    me: apiCall.bind(this, 'users.me'),
  },
  products: {
    info: apiCall.bind(this, 'products.info'),
    list: apiCall.bind(this, 'products.list'),
    setQuestions: apiCall.bind(this, 'products.setQuestions'),
    users: {
      list: apiCall.bind(this, 'products.users.list'),
      getSuggestions: apiCall.bind(this, 'products.users.getSuggestions'),
      add: apiCall.bind(this, 'products.users.add'),
      remove: apiCall.bind(this, 'products.users.remove'),
      setRole: apiCall.bind(this, 'products.users.setRole'),
    },
  },
  scopes: {
    list: apiCall.bind(this, 'scopes.list'),
    setName: apiCall.bind(this, 'scopes.setName'),
    create: apiCall.bind(this, 'scopes.create'),
    archive: apiCall.bind(this, 'scopes.archive'),
    setResponsible: apiCall.bind(this, 'scopes.setResponsible'),
  },
  feedbacks: {
    list: apiCall.bind(this, 'feedbacks.list'),
    info: apiCall.bind(this, 'feedbacks.info'),
    setRoadmapItem: apiCall.bind(this, 'feedbacks.setRoadmapItem'),
    archive: apiCall.bind(this, 'feedbacks.archive'),
    addComment: apiCall.bind(this, 'feedbacks.addComment'),
  },
  roadmapItems: {
    list: apiCall.bind(this, 'roadmapItems.list'),
    create: apiCall.bind(this, 'roadmapItems.create'),
  },
};
