const path = require('path');

const Promise = require('bluebird');
const pick = require('lodash/pick');
const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');

const { SENDGRID_API_KEY } = process.env;

const renderFile = Promise.promisify(ejs.renderFile);

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (template, data = {}, message = {}) => {
  if (!SENDGRID_API_KEY) {
    return;
  }
  const text = await renderFile(
    path.join(__dirname, 'templates', `${template}.ejs`),
    data,
  );
  const msg = {
    ...pick(message, ['to', 'from', 'subject']),
    text,
  };
  await sgMail.send(msg);
};

module.exports = {
  sendMail,
};
