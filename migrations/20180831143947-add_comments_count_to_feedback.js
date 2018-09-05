const Promise = require('bluebird');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'comments_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    const feedbacks = await queryInterface.sequelize.query(
      `
        SELECT
          f.id AS id,
          count(fc.id) AS "commentsCount"
        FROM feedback f
        INNER JOIN feedback_comment fc
          ON fc.feedback_id = f.id
        GROUP BY f.id
      `,
      { type: Sequelize.QueryTypes.SELECT },
    );
    await Promise.map(feedbacks, async ({ id, commentsCount }) => {
      await queryInterface.sequelize.query(
        `
        UPDATE feedback
        SET comments_count = :commentsCount
        WHERE id = :id
      `,
        { replacements: { id, commentsCount } },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'comments_count');
  },
};
