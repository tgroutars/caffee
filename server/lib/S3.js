const Promise = require('bluebird');
const S3 = require('aws-sdk/clients/s3');
const axios = require('axios');

const { AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const s3 = new S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const upload = ({ key, body }) =>
  new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: AWS_S3_BUCKET,
        Key: key,
        Body: body,
      },
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      },
    );
  });

const uploadFromURL = async ({ key, url }) => {
  const { data: fileStream } = await axios.get(url, {
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: AWS_S3_BUCKET,
        Key: key,
        Body: fileStream,
      },
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      },
    );
  });
};

const getURLFromKey = key => `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;

const fileExists = async key => {
  try {
    await s3
      .headObject({
        Bucket: AWS_S3_BUCKET,
        Key: key,
      })
      .promise();
    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    }
    throw err;
  }
};

module.exports = {
  upload,
  getURLFromKey,
  uploadFromURL,
  fileExists,
};
