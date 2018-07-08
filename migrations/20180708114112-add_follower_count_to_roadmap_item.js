const Promise = require('bluebird');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roadmap_item', 'follower_count', {
      type: Sequelize.INTEGER,
    });
    const roadmapItems = await queryInterface.sequelize.query(
      `
        SELECT
          ri.id AS id,
          COUNT(rif.id) AS "followerCount"
        FROM roadmap_item ri
        LEFT JOIN roadmap_item_follow rif
          ON rif.roadmap_item_id = ri.id
        GROUP BY ri.id
      `,
      { type: Sequelize.QueryTypes.SELECT },
    );

    await Promise.map(roadmapItems, async roadmapItem => {
      await queryInterface.sequelize.query(
        `
          UPDATE roadmap_item
          SET follower_count = :followerCount
          WHERE id = :roadmapItemId
        `,
        {
          replacements: {
            followerCount: roadmapItem.followerCount,
            roadmapItemId: roadmapItem.id,
          },
        },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roadmap_item', 'follower_count');
  },
};
