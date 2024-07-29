import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { CDN_MODULE_OPTIONS } from './constants';
import { CdnModuleOptions } from './interfaces/cdn-module-options.interface';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RequestPresigningArguments } from '@smithy/types';

@Injectable()
export class CdnService implements OnModuleDestroy {
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

  async getUploadUrl(file: string, lifetime: number): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      ContentType: 'image/png',
      Key: file,
    });

    const options: RequestPresigningArguments = {
      expiresIn: lifetime,
    };

    return getSignedUrl(this.client, command, options);
  }

  async delete(file: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: file,
    });

    await this.client.send(command);
  }

  getPublicUrl(file: string) {
    return `${this.publicUrl}/${file}`;
  }

  onModuleDestroy() {
    this.client.destroy();
  }
}
