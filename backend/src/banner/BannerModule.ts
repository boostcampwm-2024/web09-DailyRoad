import { Module } from '@nestjs/common';
import { BannerController } from './BannerController';
import { BannerService } from './BannerService';
import { BannerRepository } from './BannerRepository';

@Module({
  controllers: [BannerController],
  providers: [BannerService, BannerRepository],
})
export class BannerModule {}
