const Promise = require('bluebird');
const S3 = require('aws-sdk/clients/s3');

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

module.exports = {
  upload,
};
