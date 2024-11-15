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
    'post',
    baseDirname,
    params.dirname,
    getUUIDName(params.extension),
  );

  const signedUrlExpireSeconds = 300;
  const contentType = 'image/*';
  const ACL = 'public-read';

  const maxFileSize = 3 * 1024 * 1024;

  const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    signatureVersion: 'v4',
  });

  const post = S3.createPresignedPost({
    Bucket: bucketName,
    Conditions: [['content-length-range', 0, maxFileSize]],
    ContentType: contentType,
    Expires: signedUrlExpireSeconds,
    Fields: {
      key: objectName,
      'Content-Type': contentType,
      acl: ACL,
    },
  });

  const uploadedUrl = path.join(ENDPOINT_URL, bucketName, objectName);

  console.log(post);
  console.log(`${uploadedUrl}에 업로드 됩니다`);

  return { ...post, uploadedUrl };
}

function getUUIDName(extension) {
  const { v4: uuidv4 } = require('uuid');
  return uuidv4().substring(0, 13).replace('-', '') + '.' + extension;
}
