import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { StorageService } from '@src/storage/StorageService';
import { PreSignedPostRequest } from '@src/storage/dto/PreSignedPostRequest';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';

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
