const crypto = require('crypto');
const mime = require('mime-types');

const { getURLFromKey, uploadFromURL, fileExists } = require('../../../lib/S3');

const findOrUploadFile = async ({ name, id, url, bytes: size }) => {
  const mimetype = mime.lookup(name);
  const nameMatch = name.match(/^caffee:([A-z 0-9]+)_(.*)$/);
  console.log(nameMatch);
  if (nameMatch) {
    const [, key, realName] = nameMatch;
    return {
      key,
      size,
      mimetype,
      name: realName,
      url: getURLFromKey(key),
    };
  }
  const key = crypto
    .createHash('md5')
    .update(`trello_id:${id}`)
    .digest('hex');
  if (await fileExists(key)) {
    return {
      key,
      size,
      mimetype,
      name,
      url: getURLFromKey(key),
    };
  }
  const { Location } = await uploadFromURL({ key, url });
  return {
    key,
    size,
    name,
    mimetype,
    url: Location,
  };
};

module.exports = {
  findOrUploadFile,
};
