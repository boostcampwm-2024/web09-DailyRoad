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
import { UpdateBannerDetailsRequest } from '@src/admin/banner/dto/UpdateBannerDetailsRequest';

@Controller()
export class AdminBannerController {
  constructor(private readonly bannerService: AdminBannerService) {}

  @Get()
  async getAllBannerList() {
    return await this.bannerService.getAllBannerList();
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
  async updateBannerDetails(
    @Param('id') id: number,
    @Body() updateDetailsRequest: UpdateBannerDetailsRequest,
  ) {
    return await this.bannerService.updateBannerDetails(
      id,
      updateDetailsRequest,
    );
  }

  @Delete('/:id')
  async deleteBanner(@Param('id') id: number) {
    return await this.bannerService.deleteBanner(id);
  }
}
