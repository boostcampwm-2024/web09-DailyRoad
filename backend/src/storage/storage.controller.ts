import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';
import { PreSignedPostRequest } from './dto/PreSignedPostRequest';
import { Throttle } from '@nestjs/throttler';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('/preSignedPost')
  @UseGuards(JwtAuthGuard)
  async getPreSignedPost(@Body() preSignedPostRequest: PreSignedPostRequest) {
    const { dirName, extension } = preSignedPostRequest;
    return await this.storageService.generatePreSignedPost(dirName, extension);
  }
}
