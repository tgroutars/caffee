const { BacklogStage: BacklogStageService } = require('../../../../services');

const updateList = async payload => {
  const { old, list } = payload.action.data;

  if (old.closed === false && list.closed) {
    await BacklogStageService.destroy({ where: { trelloRef: list.id } });
  }
};

module.exports = updateList;
