module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product_user', 'role', {
      type: Sequelize.ENUM('author', 'user', 'admin'),
      allowNull: false,
      defaultValue: 'author',
    });
    await queryInterface.sequelize.query(`
      UPDATE product_user SET role = 'admin';
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DELETE FROM product_user where role <> 'admin';
    `);
    await queryInterface.removeColumn('product_user', 'role');
    await queryInterface.sequelize.query(`
      DROP TYPE enum_product_user_role;
    `);
  },
};
