import { Type } from '@nestjs/common';

export interface CdnModuleOptions {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

export interface CdnModuleAsyncOptions {
  imports?: any[];
  useExisting?: Type;
  useClass?: Type;
  useFactory?: (...args: any[]) => Promise<CdnModuleOptions> | CdnModuleOptions;
  inject?: any[];
}
