import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
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

  updateFields(files: Map<string, Express.Multer.File[]>, getKeyFn) {
    return Promise.all(
      Object.keys(files).map((filename) => {
        return Promise.all(
          files[filename].map((file) => this.upload(file, getKeyFn)),
        );
      }),
    );
  }

  upload(file: Express.Multer.File, getKeyFn) {
    return this.s3
      .upload({
        Bucket: this.BUCKET_NAME,
        ACL: 'public-read',
        Key: getKeyFn(file),
        Body: file.buffer,
      })
      .promise();
  }
}
