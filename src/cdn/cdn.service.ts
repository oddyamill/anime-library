import { Inject, Injectable } from '@nestjs/common';
import { CDN_MODULE_OPTIONS } from './constants';
import { CdnModuleOptions } from './interfaces/cdn-module-options.interface';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { RequestPresigningArguments } from '@smithy/types';

@Injectable()
export class CdnService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(@Inject(CDN_MODULE_OPTIONS) options: CdnModuleOptions) {
    this.client = new S3Client({
      endpoint: options.endpoint,
      region: 'auto',
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
    this.bucket = options.bucket;
    this.publicUrl = options.publicUrl;
  }

  async getUploadUrl(url: string, lifetime: number): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      ContentType: 'image/png',
      Key: url,
    });

    const options: RequestPresigningArguments = {
      expiresIn: lifetime,
    };

    return getSignedUrl(this.client, command, options);
  }

  async delete(url: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: url,
    });

    await this.client.send(command);
  }

  getPublicUrl(url: string) {
    return `${this.publicUrl}/${url}`;
  }
}
