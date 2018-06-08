/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);

const services = {};
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    const Service = require(`./${file}`);
    services[Service.key] = Service(services);
  });

module.exports = services;
