import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ImageService } from './image.service';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/preSignedURL/:dirName/:extension')
  @UseGuards(JwtAuthGuard)
  async getPreSignedURL(
    @Param('dirName') dirName: string,
    @Param('extension') extension: string,
  ) {
    return await this.imageService.generatePreSignedURL(dirName, extension);
  }
}
