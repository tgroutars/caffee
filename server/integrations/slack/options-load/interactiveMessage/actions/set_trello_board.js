const Fuse = require('fuse.js');

const { Product } = require('../../../../../models');
const { listBoards } = require('../../../../trello/helpers/api');

const filterBoards = (boards, searchText) => {
  if (!searchText) {
    return boards;
  }
  const fuse = new Fuse(boards, { keys: ['name'] });
  return fuse.search(searchText);
};

module.exports = async payload => {
  const {
    name: { productId },
    value,
  } = payload;
  const product = await Product.findById(productId);
  const boards = (await listBoards(product.trelloAccessToken)).map(
    ({ id, name }) => ({ id, name }),
  );
  const filteredBoards = filterBoards(boards, value);
  return filteredBoards.map(({ id, name }) => ({
    text: name,
    value: { boardId: id },
  }));
};
