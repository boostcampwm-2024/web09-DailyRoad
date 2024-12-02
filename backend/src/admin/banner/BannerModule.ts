import { Module } from '@nestjs/common';
import { AdminBannerService } from '@src/admin/banner/BannerService';
import { AdminBannerRepository } from '@src/admin/banner/BannerRepository';
import { AdminBannerController } from '@src/admin/banner/BannerController';

@Module({
  controllers: [AdminBannerController],
  providers: [AdminBannerService, AdminBannerRepository],
})
export class AdminBannerModule {}
