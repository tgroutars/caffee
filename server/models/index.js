const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');

const basename = path.basename(module.filename);
const config = require('../config/db');

const opts = process.env.DATABASE_URL
  ? [process.env.DATABASE_URL]
  : [config.database, config.username, config.password];
const sequelize = new Sequelize(...opts, config);

const db = {};

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    const modelName = upperFirst(camelCase(model.name));
    db[modelName] = model;
    model.db = db;
  });

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
