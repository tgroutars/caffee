/* eslint-disable global-require,import/no-dynamic-require */

const services = {};
['SlackWorkspace'].forEach(serviceName => {
  services[serviceName] = require(`./${serviceName}`)(services);
});

module.exports = services;
