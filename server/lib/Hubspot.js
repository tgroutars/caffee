const Hubspot = require('hubspot');

const { HUBSPOT_API_KEY } = process.env;

const createContact = async email => {
  if (!HUBSPOT_API_KEY) {
    return;
  }
  const hubspot = new Hubspot({ apiKey: HUBSPOT_API_KEY });
  await hubspot.contacts.create({
    properties: [
      {
        property: 'email',
        value: email,
      },
    ],
  });
};

module.exports = {
  createContact,
};
