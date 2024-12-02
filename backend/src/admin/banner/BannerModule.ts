import { Module } from '@nestjs/common';
import { AdminBannerService } from './BannerService';
import { AdminBannerRepository } from './BannerRepository';
import { AdminBannerController } from './BannerController';

@Module({
  controllers: [AdminBannerController],
  providers: [AdminBannerService, AdminBannerRepository],
})
export class AdminBannerModule {}
