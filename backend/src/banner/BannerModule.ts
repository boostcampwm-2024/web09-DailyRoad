import { Module } from '@nestjs/common';
import { BannerController } from '@src/banner/BannerController';
import { BannerService } from '@src/banner/BannerService';
import { BannerRepository } from '@src/banner/BannerRepository';

@Module({
  controllers: [BannerController],
  providers: [BannerService, BannerRepository],
})
export class BannerModule {}
