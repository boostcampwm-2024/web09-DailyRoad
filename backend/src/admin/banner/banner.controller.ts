import { Controller, Get } from '@nestjs/common';
import { AdminBannerService } from './banner.service';

@Controller()
export class AdminBannerController {
  constructor(private readonly bannerService: AdminBannerService) {}

  @Get()
  async getAllBannerList() {
    return await this.bannerService.getAllBannerList();
  }
}
