/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const events = {};

const basename = path.basename(module.filename);

fs.readdirSync(__dirname)
  .filter(file => file !== basename)
  .forEach(file => {
    const event = require(`./${file}`);
    const type = file.split('.')[0];
    events[type] = event;
  });

module.exports = events;
