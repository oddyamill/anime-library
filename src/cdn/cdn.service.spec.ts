import { Test, TestingModule } from '@nestjs/testing';
import { CdnService } from './cdn.service';
import { CDN_MODULE_OPTIONS } from './constants';
import { CdnModuleOptions } from './interfaces/cdn-module-options.interface';

describe('CdnService', () => {
  let service: CdnService;

  const moduleOptions: Pick<CdnModuleOptions, 'publicUrl'> = {
    publicUrl: 'http://localhost',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CDN_MODULE_OPTIONS,
          useValue: moduleOptions,
        },
        CdnService,
      ],
    }).compile();

    service = module.get<CdnService>(CdnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`should return http://localhost/file`, () => {
    expect(service.getPublicUrl('file')).toBe(
      `${moduleOptions.publicUrl}/file`,
    );
  });
});
