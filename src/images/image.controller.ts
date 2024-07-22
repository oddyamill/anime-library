import { Controller, Get, Post } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImageController {
  constructor(private readonly images: ImagesService) {}

  @Get()
  async getAll() {
    return this.images.getAll();
  }

  @Post()
  async create() {
    return this.images.create();
  }
}
