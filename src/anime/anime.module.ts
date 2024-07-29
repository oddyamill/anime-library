import { Module } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anime } from './anime.entity';
import { AnimeController } from './anime.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Anime])],
  controllers: [AnimeController],
  providers: [AnimeService],
  exports: [AnimeService],
})
export class AnimeModule {}
