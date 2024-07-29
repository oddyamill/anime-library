import { Controller, Get, Param } from '@nestjs/common';
import { AnimeService } from './anime.service';

@Controller('anime')
export class AnimeController {
  constructor(private readonly anime: AnimeService) {}

  @Get()
  async getAll() {
    return this.anime.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.anime.getOne(id);
  }
}
