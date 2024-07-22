import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from './anime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anime])],
  providers: [AnimeService],
  exports: [AnimeService],
})
export class AnimeModule {}
