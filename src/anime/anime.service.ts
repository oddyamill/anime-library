import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Anime } from './anime.entity';
import { Repository } from 'typeorm';
import { AnilistAnime } from './interfaces/anilist-anime.interface';
import { TraceMoeAnime } from './interfaces/tracemoe-anime.interface';
import { ANILIST_URL, TRACE_MOE_URL } from '../constants';

@Injectable()
export class AnimeService {
  constructor(@InjectRepository(Anime) private repository: Repository<Anime>) {}

  async getAll() {
    return this.repository.find();
  }

  async getOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['images'] });
  }

  async findOrCreate(anilistId: number) {
    const found = await this.repository.findOneBy({ anilistId });
    if (found !== null) {
      return found;
    }

    const anilistAnime = await this.fetchAnilist(anilistId);

    const anime = this.repository.create({
      title: anilistAnime.title.native,
      anilistId: anilistAnime.id,
      malId: anilistAnime.idMal,
      banner: anilistAnime.coverImage.large,
    });

    return this.repository.save(anime);
  }

  async fetchTraceMoe(url: string) {
    const query = new URLSearchParams({
      url,
    });
    const response = await fetch(`${TRACE_MOE_URL}?${query}`);
    if (!response.ok) {
      return;
    }

    return (await response.json()).result[0] as TraceMoeAnime;
  }

  private async fetchAnilist(id: number) {
    const query = `
query ($id: Int) {
  Media (id: $id, type: ANIME) {
    id
    idMal
    title {
      native
    }
    coverImage {
      large
    }
  }
}
`;

    const response = await fetch(ANILIST_URL, {
      body: JSON.stringify({
        query,
        variables: { id },
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new InternalServerErrorException('Anilist API request failed');
    }

    return (await response.json()).data.Media as AnilistAnime;
  }
}
