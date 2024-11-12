import { Module } from '@nestjs/common';
import { AdminBannerService } from './banner.service';
import { AdminBannerRepository } from './banner.repository';
import { AdminBannerController } from './banner.controller';

@Module({
  controllers: [AdminBannerController],
  providers: [AdminBannerService, AdminBannerRepository],
})
export class AdminBannerModule {}
