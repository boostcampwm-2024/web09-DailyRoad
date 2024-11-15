function main(params) {
  const AWS = require('aws-sdk');

  const ENDPOINT_URL = 'https://kr.object.ncloudstorage.com';
  const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
  const region = 'kr-standard';
  const accessKey = params.access;
  const secretKey = params.secret;

  const bucketName = 'ogil-public';
  const baseDirname = 'uploads';

  const objectName = path.join(
    baseDirname,
    params.dirname,
    getUUIDName(params.extension),
  );

  const signedUrlExpireSeconds = 300;
  const contentType = 'image/*';
  const ACL = 'public-read';

  const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    signatureVersion: 'v4',
  });

  const url = S3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: objectName,
    Expires: signedUrlExpireSeconds,
    ContentType: contentType,
    ACL,
  });

  const uploadedUrl = path.join(ENDPOINT_URL, bucketName, objectName);

  console.log({ url, uploadedUrl });
  return { url, uploadedUrl };
}

function getUUIDName(extension) {
  const { v4: uuidv4 } = require('uuid');
  return uuidv4().substring(0, 13).replace('-', '') + '.' + extension;
}
