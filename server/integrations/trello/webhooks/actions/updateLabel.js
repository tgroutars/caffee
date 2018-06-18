const { Tag: TagService } = require('../../../../services');

const updateLabel = async payload => {
  const { label, old } = payload.action.data;

  if (typeof old.name !== 'undefined' && label.name) {
    await TagService.updateByTrelloRef(label.id, { name: label.name });
  }
};

module.exports = updateLabel;
