const Promise = require('bluebird');

const { BacklogStage: BacklogStageService } = require('../../../../services');
const { Product } = require('../../../../models');
const { fetchList } = require('../../helpers/api');

const syncList = async (product, listId) => {
  const list = await fetchList(product.trelloAccessToken, { listId });
  return BacklogStageService.create({
    productId: product.id,
    position: list.pos,
    name: list.name,
    trelloRef: list.id,
  });
};

const createList = async payload => {
  const {
    board,
    list: { id: listId },
  } = payload.action.data;
  const products = await Product.findAll({
    where: { trelloBoardId: board.id },
  });

  await Promise.map(products, async product => syncList(product, listId));
};

module.exports = createList;
