const crypto = require('crypto');
const axios = require('axios');

const S3 = require('../../../lib/S3');

const downloadFile = async (url, accessToken) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: 'stream',
  });

  return response.data;
};

const syncFile = async (file, accessToken) => {
  const { url_private: url, name, mimetype, size } = file;
  const key = crypto
    .createHash('md5')
    .update(`slack_url:${url}`)
    .digest('hex');
  const stream = await downloadFile(url, accessToken);
  const { Location } = await S3.upload({
    key,
    body: stream,
    ContentDisposition: `attachment; filename=${name}`,
    ContentType: mimetype,
  });
  return { url: Location, name, mimetype, size, key };
};

module.exports = { downloadFile, syncFile };
