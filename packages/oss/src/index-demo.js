// import shell from 'shelljs'
// const shell = require('shelljs')

// shell.exec('docker run -p 9001:9001 --user $(id -u):$(id -g) -e "MINIO_ROOT_USER=ROOTUSER" -e "MINIO_ROOT_PASSWORD=CHANGEME123" -v ${HOME}/minio/data:/data quay.io/minio/minio server /data --console-address ":9001"')
const fs = require('fs')

var Minio = require('minio')

var minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'admin',
    secretKey: 'admin123'
});




async function main() {

  // await minioClient.setBucketPolicy(
  //   'europetrip',
  //   JSON.stringify(policy),
  //   function (err) {
  //     if (err) throw err;
  //     console.log('Bucket policy set');
  //   },
  // );
  const file = fs.createReadStream('/Users/zhuchongyue/sfzz.jpeg')

  const res = await minioClient.putObject('europetrip', 'abc.jpeg', file)

  console.log('res: ', res)
}

// main()

async function createBuket() {
  minioClient.makeBucket('test-bu')

}

async function setBucketPolicy(name) {
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Action: [
          's3:ListBucketMultipartUploads',
          's3:GetBucketLocation',
          's3:ListBucket',
        ],
        Resource: [`arn:aws:s3:::${name}`], // Change this according to your bucket name
      },
      {
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Action: [
          's3:PutObject',
          's3:AbortMultipartUpload',
          's3:DeleteObject',
          's3:GetObject',
          's3:ListMultipartUploadParts',
        ],
        Resource: [`arn:aws:s3:::${name}/*`], // Change this according to your bucket name
      },
    ],
  };

  await minioClient.setBucketPolicy(
    name,
    JSON.stringify(policy),
    function (err) {
      if (err) throw err;
      console.log('Bucket policy set');
    },
  );
}

setBucketPolicy('test-bu')

// createBuket()



// File that needs to be uploaded.
// var file = '/Users/zhuchongyue/vue2-micro-template-main.tar.gz'

// Make a bucket called europetrip.
// minioClient.makeBucket('europetrip', 'us-east-1', function(err) {
//     if (err) return console.log(err)

//     console.log('Bucket created successfully in "us-east-1".')

//     var metaData = {
//         'Content-Type': 'application/octet-stream',
//         'X-Amz-Meta-Testing': 1234,
//         'example': 5678
//     }
//     // Using fPutObject API upload your file to the bucket europetrip.
//     minioClient.fPutObject('europetrip', 'photos-europe.tar', file, metaData, function(err, etag) {
//       if (err) return console.log(err)
//       console.log('File uploaded successfully.')
//     });
// });