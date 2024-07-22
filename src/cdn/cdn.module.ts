import { DynamicModule, Module, Global, Provider } from '@nestjs/common';
import { CdnService } from './cdn.service';
import { CDN_MODULE_OPTIONS } from './constants';
import {
  CdnModuleAsyncOptions,
  CdnModuleOptions,
} from './interfaces/cdn-module-options.interface';

@Global()
@Module({})
export class CdnModule {
  static forRoot(options: CdnModuleOptions): DynamicModule {
    return {
      module: CdnModule,
      providers: [
        {
          provide: CDN_MODULE_OPTIONS,
          useValue: options,
        },
        CdnService,
      ],
      exports: [CdnService],
    };
  }

  static forRootAsync(options: CdnModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options);
    return {
      module: CdnModule,
      imports: options.imports || [],
      providers: [...providers, CdnService],
      exports: [CdnService],
    };
  }

  private static createAsyncProviders(
    options: CdnModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [
        {
          provide: CDN_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    return [];
  }
}
