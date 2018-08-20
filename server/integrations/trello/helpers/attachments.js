const crypto = require('crypto');
const mime = require('mime-types');

const { getURLFromKey, uploadFromURL, fileExists } = require('../../../lib/S3');

const findOrUploadFile = async ({ name, id, url, bytes: size }) => {
  const mimetype = mime.lookup(name);
  const nameMatch = name.match(/^caffee:([A-z 0-9]+)_(.*)$/);
  if (nameMatch) {
    const key = nameMatch[1];
    const realName = nameMatch[2].split('_')[0];
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
  const params = {
    key,
    url,
    ContentDisposition: `attachment; filename: ${name}`,
  };
  if (mimetype) {
    params.ContentType = mimetype;
  }
  const { Location } = await uploadFromURL(params);
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
