const axios = require('axios');
const Promise = require('bluebird');
const FormData = require('form-data');

const { TRELLO_API_KEY } = process.env;
const EXTERNAL_BASE_URL = process.env.EXTERNAL_BASE_URL || process.env.BASE_URL;
const WEBHOOK_URL = `${EXTERNAL_BASE_URL}/integrations/trello/webhook`;

const makeRequest = async (
  accessToken,
  { url, method = 'GET', data, params = {}, headers },
) => {
  const allParams = Object.assign(
    { token: accessToken, key: TRELLO_API_KEY },
    params,
  );

  const response = await axios({
    url,
    method,
    data,
    headers,
    baseURL: 'https://trello.com/1',
    params: allParams,
  });
  return response.data;
};

const createBoard = async (
  accessToken,
  { name, desc, permissionLevel, defaultLabels = false, defaultLists = false },
) =>
  makeRequest(accessToken, {
    url: `/boards`,
    method: 'POST',
    params: {
      name,
      desc,
      defaultLabels,
      defaultLists,
      prefs_permissionLevel: permissionLevel,
    },
  });

const createLabel = async (accessToken, { boardId, name, color }) =>
  makeRequest(accessToken, {
    url: `/boards/${boardId}/labels`,
    method: 'POST',
    params: { name, color },
  });

const createList = async (accessToken, { boardId, name, pos }) =>
  makeRequest(accessToken, {
    url: `/boards/${boardId}/lists`,
    method: 'POST',
    params: { name, pos },
  });

const fetchBoard = async (accessToken, { boardId }) =>
  makeRequest(accessToken, {
    url: `/boards/${boardId}`,
    method: 'GET',
  });

const fetchAttachment = async (accessToken, { cardId, attachmentId }) =>
  makeRequest(accessToken, {
    url: `/cards/${cardId}/attachments/${attachmentId}`,
    method: 'GET',
  });

const listBoards = async accessToken => {
  const boards = await makeRequest(accessToken, {
    url: '/members/me/boards',
    method: 'GET',
    params: { filter: 'open' },
  });
  return boards;
};

const listLists = async (accessToken, { boardId, filter = 'all' }) => {
  const lists = await makeRequest(accessToken, {
    url: `/boards/${boardId}/lists/${filter}`,
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

const listCards = async (accessToken, { boardId, includeAttachments }) => {
  const cards = await makeRequest(accessToken, {
    url: `/boards/${boardId}/cards/all`,
    method: 'GET',
    params: { attachments: includeAttachments },
  });
  return cards;
};

const addAttachmentToCard = async (
  accessToken,
  { cardId, attachment: { url, name, mimetype } },
) => {
  const { data: fileStream } = await axios.get(url, {
    responseType: 'stream',
  });

  const formData = new FormData();
  formData.append('mimeType', mimetype);
  formData.append('name', name);
  formData.append('file', fileStream, name);
  return new Promise((resolve, reject) => {
    formData.getLength((err, length) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        makeRequest(accessToken, {
          url: `/cards/${cardId}/attachments`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${
              formData._boundary
            }`,
            'Content-Length': length,
          },
        }),
      );
    });
  });
};

const createCard = async (
  accessToken,
  { listId, title, description, labelIds = [], attachments = [] },
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
  await Promise.map(attachments, async attachment =>
    addAttachmentToCard(accessToken, { attachment, cardId: card.id }),
  );
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
  createBoard,
  createLabel,
  createList,
  listBoards,
  listLists,
  addAttachmentToCard,
  createCard,
  fetchAttachment,
  addComment,
  listCards,
  listLabels,
  createWebhook,
  destroyWebhook,
  fetchList,
  fetchBoard,
};
