const Promise = require('bluebird');
const winston = require('winston');

const { Product, BacklogItem } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');
const {
  listCards,
  createWebhook,
} = require('../integrations/trello/helpers/api');

const ProductService = (/* services */) => ({
  async create({ name, image, ownerId }) {
    return Product.create({
      name,
      image,
      ownerId,
    });
  },

  async setTrelloTokens(
    productId,
    { accessToken, accessTokenSecret, installer },
  ) {
    await Product.update(
      {
        trelloAccessToken: accessToken,
        trelloAccessTokenSecret: accessTokenSecret,
      },
      { where: { id: productId } },
    );
    await trigger('trello_installed', { productId, installer });
  },

  async setTrelloBoard(productId, boardId) {
    await Product.update(
      { trelloBoardId: boardId },
      { where: { id: productId } },
    );
    await trigger('product_trello_board_changed', { productId });
  },

  // TODO: Danger => Trello limits API to 100 request per token per 10 second
  async syncTrelloBoard(product) {
    const { trelloAccessToken, trelloBoardId } = product;
    const cards = await listCards(trelloAccessToken, {
      boardId: trelloBoardId,
    });

    try {
      await createWebhook(trelloAccessToken, { modelId: trelloBoardId });
    } catch (err) {
      winston.error(
        `Could not create board webhook for productId=${
          product.id
        } boardRef=${trelloBoardId}`,
      );
    }

    // Remove old backlog items
    await BacklogItem.destroy({
      where: { productId: product.id },
    });

    // Add new items
    await Promise.map(cards, async ({ idList, name, desc, id }) => {
      await BacklogItem.create({
        productId: product.id,
        trelloRef: id,
        trelloListRef: idList,
        title: name,
        description: desc,
      });
    });
  },
});

module.exports = ProductService;
