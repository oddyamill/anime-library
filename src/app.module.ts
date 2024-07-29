import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CdnModule } from './cdn/cdn.module';
import { AnimeModule } from './anime/anime.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST', 'localhost'),
        port: config.get('POSTGRES_PORT', 5432),
        username: config.getOrThrow('POSTGRES_USER'),
        password: config.getOrThrow('POSTGRES_PASSWORD'),
        database: config.getOrThrow('POSTGRES_DB'),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    CdnModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        endpoint: config.getOrThrow('CDN_ENDPOINT'),
        accessKeyId: config.getOrThrow('CDN_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow('CDN_SECRET_ACCESS_KEY'),
        bucket: config.getOrThrow('CDN_BUCKET'),
        publicUrl: config.getOrThrow('CDN_PUBLIC_URL'),
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    AnimeModule,
    ImagesModule,
  ],
})
export class AppModule {}
