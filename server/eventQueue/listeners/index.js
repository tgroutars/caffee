/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const { addListener } = require('../eventQueue');

const init = () => {
  const basename = path.basename(module.filename);

  fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename)
    .forEach(file => {
      const listener = require(`./${file}`);
      const eventType = file.split('.')[0];
      addListener(eventType, listener);
    });
};

module.exports = { init };
