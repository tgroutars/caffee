const axios = require('axios');

const apiKey = process.env.TRELLO_API_KEY;

const makeRequest = async (
  accessToken,
  { url, method = 'GET', data, params = {} },
) => {
  const allParams = Object.assign({ token: accessToken, key: apiKey }, params);

  const response = await axios({
    url,
    method,
    data,
    baseURL: 'https://trello.com/1',
    params: allParams,
  });
  return response.data;
};

const listBoards = async accessToken => {
  const boards = await makeRequest(accessToken, {
    url: '/members/me/boards',
    method: 'GET',
    params: { filter: 'open' },
  });
  return boards.map(({ name, id }) => ({
    name,
    id,
  }));
};

module.exports = {
  makeRequest,
  listBoards,
};
