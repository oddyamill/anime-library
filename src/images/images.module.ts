import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImagesService } from './images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImagesProcessor } from './images.processor';
import { BullModule } from '@nestjs/bullmq';
import { AnimeModule } from '../anime/anime.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    BullModule.registerQueue({ name: 'images' }),
    AnimeModule,
  ],
  controllers: [ImageController],
  providers: [ImagesService, ImagesProcessor],
})
export class ImagesModule {}
