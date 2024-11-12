import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { BannerRepository } from './banner.repository';

@Module({
  controllers: [BannerController],
  providers: [BannerService, BannerRepository],
})
export class BannerModule {}
