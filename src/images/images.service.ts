import { Injectable } from '@nestjs/common';
import { CdnService } from '../cdn/cdn.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { randomBytes } from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TraceMoeAnime } from '../anime/interfaces/tracemoe-anime.interface';
import { AnimeService } from '../anime/anime.service';
import { UPLOAD_TIME } from '../constants';

@Injectable()
export class ImagesService {
  constructor(
    private readonly cdn: CdnService,
    private readonly anime: AnimeService,
    @InjectRepository(Image) private readonly repository: Repository<Image>,
    @InjectQueue('images') private readonly queue: Queue,
  ) {}

  async create() {
    const file = this.generateFile();

    await this.queue.add('fetch', file, {
      delay: UPLOAD_TIME * 1000,
    });

    return {
      url: this.cdn.getPublicUrl(file),
      uploadUrl: await this.cdn.getUploadUrl(file, UPLOAD_TIME),
    };
  }

  async final(file: string, match: TraceMoeAnime) {
    const anime = await this.anime.findOrCreate(match.anilist);

    const image = this.repository.create({
      anime,
      file,
      from: match.from,
      to: match.to,
      episode: match.episode,
    });

    await this.repository.save(image);
  }

  private generateFile() {
    return randomBytes(16).toString('hex') + '.png';
  }
}
