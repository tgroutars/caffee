const Sequelize = require('sequelize');
const pg = require('pg');

pg.defaults.parseInt8 = true;

const { DATABASE_URL, NODE_ENV = 'development' } = process.env;

const defaultConfig = {
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
  define: {
    paranoid: true,
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
  },
};

const configs = {
  development: {
    database: 'caffee',
    host: '127.0.0.1',
    pool: {
      max: 50,
    },
  },
  test: {
    host: '127.0.0.1',
    logging: false,
    pool: {
      max: 5,
    },
  },
  production: {
    logging: false,
    url: DATABASE_URL,
    dialectOptions: {
      ssl: true,
    },
    pool: {
      max: 12, // Heroku limits this to 20
    },
  },
};

if (DATABASE_URL) {
  configs.test.url = DATABASE_URL;
} else {
  configs.test.database = 'caffee_test';
}

module.exports = Object.assign({}, defaultConfig, configs[NODE_ENV]);
