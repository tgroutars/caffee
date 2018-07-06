module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('roadmap_item', 'trello_list_ref');
    await queryInterface.addColumn('roadmap_item', 'stage_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'roadmap_stage',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('roadmap_item', 'stage_id');
    await queryInterface.addColumn('roadmap_item', 'trello_ref', {
      type: Sequelize.STRING,
    });
  },
};
