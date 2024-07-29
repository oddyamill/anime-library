import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ImagesService } from './images.service';
import { CdnService } from '../cdn/cdn.service';
import { AnimeService } from '../anime/anime.service';
import { Logger } from '@nestjs/common';

@Processor('images')
export class ImagesProcessor extends WorkerHost {
  private readonly logger = new Logger(ImagesProcessor.name);

  constructor(
    private readonly images: ImagesService,
    private readonly anime: AnimeService,
    private readonly cdn: CdnService,
  ) {
    super();
  }

  async process(job: Job<string>) {
    const file = job.data;
    const match = await this.anime.fetchTraceMoe(this.cdn.getPublicUrl(file));

    if (match === undefined) {
      await this.cdn.delete(file);
      return;
    }

    this.logger.log(`Match found for ${file}`);
    await this.images.final(file, match);
  }
}
