import { Injectable } from '@nestjs/common';
import { BannerRepository } from './banner.repository';

@Injectable()
export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async getActiveBannerList() {
    return await this.bannerRepository.findAllActive();
  }
}
