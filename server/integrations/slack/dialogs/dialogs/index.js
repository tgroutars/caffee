/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const dialogs = {};

const basename = path.basename(module.filename);

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    const dialog = require(`./${file}`);
    const type = file.split('.')[0];
    dialogs[type] = dialog;
  });

module.exports = dialogs;
