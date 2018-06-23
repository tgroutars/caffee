const { BacklogStage: BacklogStageService } = require('../../../../services');

const updateList = async payload => {
  const { old, list } = payload.action.data;

  if (old.closed === false && list.closed) {
    await BacklogStageService.destroy({ where: { trelloRef: list.id } });
    return;
  }

  const values = {};
  if (typeof old.name !== 'undefined' && old.name !== list.name) {
    values.name = list.name;
  }
  if (typeof old.pos !== 'undefined' && old.pos !== list.pos) {
    values.position = list.pos;
  }
  if (Object.keys(values).length) {
    await BacklogStageService.update(values, { where: { trelloRef: list.id } });
  }
};

module.exports = updateList;
