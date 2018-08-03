const { Tag: TagService } = require('../../../../services');

const updateLabel = async payload => {
  const { label, old } = payload.action.data;

  if (typeof old.name !== 'undefined' && (label.name || label.color)) {
    await TagService.updateByTrelloRef(label.id, {
      name: label.name || label.color,
    });
  }
};

module.exports = updateLabel;
