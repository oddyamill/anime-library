import { Controller, Post } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImagesService) {}

  @Post()
  async create() {
    return this.imageService.create();
  }
}
