import { Injectable } from '@nestjs/common';
import { BannerRepository } from './banner.repository';
import { ActiveBannerListResponse } from './dto/ActiveBannerListResponse';

@Injectable()
export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async getActiveBannerList() {
    const banners = await this.bannerRepository.findAllActive();
    return ActiveBannerListResponse.from(banners);
  }
}
