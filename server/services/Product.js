const Promise = require('bluebird');

const { Product, BacklogItem, Sequelize } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');
const { listCards } = require('../integrations/trello/helpers/api');

const { Op } = Sequelize;

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

  async syncTrelloBoard(product) {
    const { trelloAccessToken, trelloBoardId } = product;
    const cards = await listCards(trelloAccessToken, {
      boardId: trelloBoardId,
    });
    const trelloRefs = cards.map(({ id }) => id);
    await BacklogItem.destroy({
      where: { trelloRef: { [Op.notIn]: trelloRefs } },
    });
    await Promise.map(cards, async ({ idList, name, desc, id }) => {
      BacklogItem.create({
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
