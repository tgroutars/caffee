const axios = require('axios');

export class APIError extends Error {}

export default class CaffeeAPI {
  constructor(token) {
    this.token = token;
    this.auth = {
      test: this.apiCall.bind(this, 'auth.test'),
      login: this.apiCall.bind(this, 'auth.login'),
    };
  }

  async apiCall(method, params) {
    const headers = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    const baseURL = process.env.BASE_URL;
    const response = await axios.post(`/api/${method}`, params, {
      headers,
      baseURL,
    });
    const { ok, payload, error } = response.data;
    if (!ok) {
      throw new Error(error);
    }
    return payload;
  }
}
