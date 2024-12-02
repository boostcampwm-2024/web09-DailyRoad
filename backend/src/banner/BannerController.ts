import { Controller, Get } from '@nestjs/common';
import { BannerService } from '@src/banner/BannerService';

@Controller('/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getBanners() {
    return await this.bannerService.getActiveBanners();
  }
}
