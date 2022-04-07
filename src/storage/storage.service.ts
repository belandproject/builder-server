import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  MAX_FILE_SIZE: number;
  s3: AWS.S3;
  BUCKET_NAME: string;

  constructor(private readonly config: ConfigService) {
    this.MAX_FILE_SIZE =
      parseInt(this.config.get('AWS_MAX_FILE_SIZE'), 10) || 10000000;
    this.BUCKET_NAME = this.config.get('AWS_S3_BUCKET_NAME');
    this.s3 = new AWS.S3({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      endpoint: this.config.get('AWS_ENDPOINT'),
    });
  }

  delete(prefix: string) {
    this.s3.listObjects(
      {
        Bucket: this.BUCKET_NAME,
        Prefix: prefix,
      },
      (err, data) => {
        if (!err) {
          return Promise.all(
            data.Contents.map((content) => {
              this.s3
                .deleteObject({
                  Bucket: this.BUCKET_NAME,
                  Key: content.Key,
                })
                .promise();
            }),
          );
        }
      },
    );
  }

  getFileUploader(
    options: { mimeTypes?: string[]; maxFileSize?: number },
    callback: (req: Request, file: Express.Multer.File) => string,
  ) {
    const { mimeTypes = [], maxFileSize = this.MAX_FILE_SIZE } = options;

    return multer({
      limits: {
        fileSize: maxFileSize,
      },
      fileFilter: function (_, file, cb) {
        if (mimeTypes.length > 0) {
          cb(null, mimeTypes.includes(file.mimetype));
        } else {
          cb(null, true);
        }
      },
      storage: multerS3({
        s3: this.s3,
        bucket: this.BUCKET_NAME,
        acl: 'public-read',
        key: (request, file, cb) => {
          try {
            cb(null, callback(request as Request, file));
          } catch (error) {
            cb(error, '');
          }
        },
      }),
    });
  }
}
