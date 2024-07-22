import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { ImagesService } from './images.service';
import { CdnService } from '../cdn/cdn.service';
import { AnimeService } from '../anime/anime.service';
import { Logger } from '@nestjs/common';

@Processor('images')
export class ImagesConsumer {
  private readonly logger = new Logger(ImagesConsumer.name);

  constructor(
    private readonly images: ImagesService,
    private readonly anime: AnimeService,
    private readonly cdn: CdnService,
  ) {}

  @Process('fetch')
  async fetch(job: Job<string>) {
    const url = job.data;
    const match = await this.anime.fetchTraceMoe(this.cdn.getPublicUrl(url));

    if (match === undefined) {
      await this.cdn.delete(url);
      return;
    }

    this.logger.log(`Match found for ${url}`);
    await this.images.final(url, match);
  }
}
