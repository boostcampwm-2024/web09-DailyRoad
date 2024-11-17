import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminBannerRepository } from './banner.repository';
import { CreateBannerRequest } from '@src/admin/banner/dto/CreateBannerRequest';
import { UpdateBannerPeriodRequest } from '@src/admin/banner/dto/UpdateBannerPeriodRequest';
import { UpdateBannerDetailsRequest } from '@src/admin/banner/dto/UpdateBannerDetailsRequest';

@Injectable()
export class AdminBannerService {
  constructor(private readonly bannerRepository: AdminBannerRepository) {}

  async getAllBannerList() {
    return await this.bannerRepository.findAll();
  }

  async createBanner(createBannerRequest: CreateBannerRequest) {
    return this.bannerRepository.create(createBannerRequest);
  }

  async updateBannerPeriod(
    id: number,
    updatePeriodRequest: UpdateBannerPeriodRequest,
  ) {
    const result = await this.bannerRepository.update(id, {
      startedAt: updatePeriodRequest.startedAt,
      endedAt: updatePeriodRequest.endedAt,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    return this.bannerRepository.findOne({ where: { id } });
  }

  async updateBannerDetails(
    id: number,
    updateDetailsRequest: UpdateBannerDetailsRequest,
  ) {
    const result = await this.bannerRepository.update(id, {
      imageUrl: updateDetailsRequest.imageUrl,
      redirectUrl: updateDetailsRequest.redirectUrl,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    return this.bannerRepository.findOne({ where: { id } });
  }

  async deleteBanner(id: number) {
    const result = await this.bannerRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    return { message: `Banner with id ${id} successfully deleted` };
  }
}
