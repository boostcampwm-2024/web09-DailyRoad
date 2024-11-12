import { Injectable } from '@nestjs/common';
import { AdminBannerRepository } from './banner.repository';

@Injectable()
export class AdminBannerService {
  constructor(private readonly bannerRepository: AdminBannerRepository) {}

  async getAllBannerList() {
    return await this.bannerRepository.findAll();
  }
}
