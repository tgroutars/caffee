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

const listLists = async (accessToken, { boardId }) => {
  const lists = await makeRequest(accessToken, {
    url: `/boards/${boardId}/lists`,
    method: 'GET',
  });
  return lists.map(({ id, name }) => ({ id, name }));
};

const createCard = async (accessToken, { listId, title, description }) => {
  const card = await makeRequest(accessToken, {
    url: '/cards',
    method: 'POST',
    data: { name: title, idList: listId, desc: description },
  });
  return card;
};

module.exports = {
  makeRequest,
  listBoards,
  listLists,
  createCard,
};
