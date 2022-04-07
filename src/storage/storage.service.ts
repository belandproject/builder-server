import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const MAX_FILE_SIZE = parseInt(process.env.AWS_MAX_FILE_SIZE, 10) || 10000000;

@Injectable()
export class StorageService {
  constructor() {}

  getFileUploader(
    options: { mimeTypes?: string[]; maxFileSize?: number },
    callback: (req: Request, file: Express.Multer.File) => string,
  ) {
    const { mimeTypes = [], maxFileSize = MAX_FILE_SIZE } = options;

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
        s3: s3,
        bucket: AWS_S3_BUCKET_NAME,
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
