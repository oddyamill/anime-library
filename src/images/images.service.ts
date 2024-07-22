import { Injectable } from '@nestjs/common';
import { CdnService } from '../cdn/cdn.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { randomBytes } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { TraceMoeAnime } from '../anime/interfaces/tracemoe-anime.interface';
import { AnimeService } from '../anime/anime.service';
import { UPLOAD_TIME } from '../constants';

@Injectable()
export class ImagesService {
  constructor(
    private readonly cdn: CdnService,
    @InjectRepository(Image) private readonly images: Repository<Image>,
    private readonly anime: AnimeService,
    @InjectQueue('images') private readonly queue: Queue,
  ) {}

  async create() {
    const url = this.generateUrl();

    await this.queue.add('fetch', url, {
      delay: UPLOAD_TIME * 1000,
    });

    return {
      url: this.cdn.getPublicUrl(url),
      uploadUrl: await this.cdn.getUploadUrl(url, UPLOAD_TIME),
    };
  }

  async final(url: string, match: TraceMoeAnime) {
    const image = this.images.create({
      anime: await this.anime.findOrCreate(match.anilist),
      url,
      from: match.from,
      to: match.to,
      episode: match.episode,
    });

    await this.images.save(image);
  }

  async getAll() {
    return this.images.find({ relations: ['anime'] });
  }

  private generateUrl() {
    return randomBytes(16).toString('hex') + '.png';
  }
}
