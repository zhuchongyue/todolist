
import * as Minio from 'minio'
import config from '@todolist/config'

export class MinioClient {

  private client: Minio.Client
  private defaultBucketName: string

  constructor(options?: Minio.ClientOptions & { defaultBucketName: string}) {

    console.log('oss constructor exec')

    const mergeOptions = Object.assign({}, {
      endPoint: process.env.OSS_HOST || config.OSS_HOST,
      port: typeof config.OSS_API_PORT === 'string' ? parseInt(config.OSS_API_PORT) : config.OSS_API_PORT,
      useSSL: false,
      accessKey: config.OSS_USER,
      secretKey: config.OSS_PASSWORD
    }, options)

    console.log('----------------------------------------------------')
    console.log('Minio client mergeOptions: ', mergeOptions)
    console.log('----------------------------------------------------')

    this.client = new Minio.Client(mergeOptions)
    this.defaultBucketName = options?.defaultBucketName ? options?.defaultBucketName  : config.OSS_BUCKET_NAME
    this.createBucket()
  }

  async createBucket(name?: string) {
    console.log('oss createBucket')
    const bucketName = name ? name : this.defaultBucketName;

    const exsit = await this.client.bucketExists(bucketName);
    if (!exsit) {
      await this.client.makeBucket(bucketName);
    }

    // 设置隐私 为了文件直接预览
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
          Resource: [`arn:aws:s3:::${bucketName}`], // Change this according to your bucket name
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
          Resource: [`arn:aws:s3:::${bucketName}/*`], // Change this according to your bucket name
        },
      ],
    };

    await this.client.setBucketPolicy(
      bucketName,
      JSON.stringify(policy),
      function (err) {
        if (err) throw err;
        console.error('Bucket policy set');
      },
    );
  }

  async putObject(params: {
    file: string | Buffer | ReadableStream;
    fileName: string;
    size?: number;
    metaData?: any;
    bucKetName?: string;
  }) {
    console.log('oss pubObject')
    const bucketName = params.bucKetName ? params.bucKetName : this.defaultBucketName;
    try {
       // @ts-ignore
      await this.client.putObject(bucketName, params.fileName, params.file, params.size, params.metaData);
    } catch(e) {
      console.error('oss pubObject err: ', e)
    }
    // 真实项目这里还要做协议的处理
    const url = `http://${config.OSS_HOST}:${config.OSS_API_PORT}/${bucketName}/${params.fileName}`;
    return url;
  }
}

export default new MinioClient()