/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const basename = path.basename(module.filename);

const messages = {};
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename)
  .forEach(file => {
    const message = require(`./${file}`);
    const onboardingStep = file.split('.')[0];
    messages[onboardingStep] = message;
  });

module.exports = (onboardingStep, ...args) => {
  if (!onboardingStep) {
    throw new Error('No onboarding step specified');
  }
  const message = messages[onboardingStep];
  if (!message) {
    throw new Error(`Unknows onboarding step: ${onboardingStep}`);
  }
  return message(...args);
};
