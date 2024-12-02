import { Controller, Get } from '@nestjs/common';
import { BannerService } from '@src/banner/BannerService';

@Controller('/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getActiveBannerList() {
    return await this.bannerService.getActiveBannerList();
  }
}
