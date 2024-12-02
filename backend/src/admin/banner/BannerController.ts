import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { AdminBannerService } from '@src/admin/banner/BannerService';
import { CreateBannerRequest } from '@src/admin/banner/dto/CreateBannerRequest';
import { UpdateBannerPeriodRequest } from '@src/admin/banner/dto/UpdateBannerPeriodRequest';
import { UpdateBannerInfoRequest } from '@src/admin/banner/dto/UpdateBannerInfoRequest';

@Controller()
export class AdminBannerController {
  constructor(private readonly bannerService: AdminBannerService) {}

  @Get()
  async getAllBanners() {
    return await this.bannerService.getAllBanners();
  }

  @Post()
  async createBanner(@Body() createBannerRequest: CreateBannerRequest) {
    return await this.bannerService.createBanner(createBannerRequest);
  }

  @Patch('/:id/period')
  async updateBannerPeriod(
    @Param('id') id: number,
    @Body() updatePeriodRequest: UpdateBannerPeriodRequest,
  ) {
    return await this.bannerService.updateBannerPeriod(id, updatePeriodRequest);
  }

  @Patch('/:id/details')
  async updateBannerInfo(
    @Param('id') id: number,
    @Body() updateBannerInfoRequest: UpdateBannerInfoRequest,
  ) {
    return await this.bannerService.updateInfo(id, updateBannerInfoRequest);
  }

  @Delete('/:id')
  async deleteBanner(@Param('id') id: number) {
    return await this.bannerService.deleteBanner(id);
  }
}
