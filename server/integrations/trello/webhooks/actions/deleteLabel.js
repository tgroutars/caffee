const { Tag: TagService } = require('../../../../services');

const deleteLabel = async payload => {
  const { label } = payload.action.data;
  await TagService.destroyByTrelloRef(label.id);
};

module.exports = deleteLabel;
