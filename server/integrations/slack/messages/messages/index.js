/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const messages = {};

const basename = path.basename(module.filename);

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    const message = require(`./${file}`);
    const type = file.split('.')[0];
    messages[type] = message;
  });

module.exports = messages;
