const axios = require('axios');

const { TRELLO_API_KEY } = process.env;
const EXTERNAL_BASE_URL = process.env.EXTERNAL_BASE_URL || process.env.BASE_URL;
const WEBHOOK_URL = `${EXTERNAL_BASE_URL}/integrations/trello/webhook`;

const makeRequest = async (
  accessToken,
  { url, method = 'GET', data, params = {} },
) => {
  const allParams = Object.assign(
    { token: accessToken, key: TRELLO_API_KEY },
    params,
  );

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
  return lists;
};

const fetchList = async (accessToken, { listId }) => {
  const list = await makeRequest(accessToken, {
    url: `/lists/${listId}`,
    method: 'GET',
  });
  return list;
};

const listLabels = async (accessToken, { boardId }) => {
  const cards = await makeRequest(accessToken, {
    url: `/boards/${boardId}/labels`,
    method: 'GET',
  });
  return cards;
};

const listCards = async (accessToken, { boardId }) => {
  const cards = await makeRequest(accessToken, {
    url: `/boards/${boardId}/cards`,
    method: 'GET',
  });
  return cards;
};

const createCard = async (
  accessToken,
  { listId, title, description, labelIds = [] },
) => {
  const card = await makeRequest(accessToken, {
    url: '/cards',
    method: 'POST',
    data: {
      name: title,
      idList: listId,
      desc: description,
      idLabels: labelIds.join(','),
    },
  });
  return card;
};

const addComment = async (accessToken, { cardId, text }) => {
  const comment = await makeRequest(accessToken, {
    url: `/cards/${cardId}/actions/comments`,
    method: 'POST',
    data: { text },
  });
  return comment;
};

const createWebhook = async (accessToken, { modelId }) => {
  const webhook = await makeRequest(accessToken, {
    url: '/webhooks',
    method: 'POST',
    data: { idModel: modelId, callbackURL: WEBHOOK_URL },
  });
  return webhook;
};

const destroyWebhook = async (accessToken, { webhookId }) => {
  await makeRequest(accessToken, {
    url: `/webhooks/${webhookId}`,
    method: 'DELETE',
  });
};

module.exports = {
  makeRequest,
  listBoards,
  listLists,
  createCard,
  addComment,
  listCards,
  listLabels,
  createWebhook,
  destroyWebhook,
  fetchList,
};
