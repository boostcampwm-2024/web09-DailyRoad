import { Injectable } from '@nestjs/common';
import { AdminBannerRepository } from '@src/admin/banner/BannerRepository';
import { CreateBannerRequest } from '@src/admin/banner/dto/CreateBannerRequest';
import { UpdateBannerPeriodRequest } from '@src/admin/banner/dto/UpdateBannerPeriodRequest';
import { UpdateBannerInfoRequest } from '@src/admin/banner/dto/UpdateBannerInfoRequest';
import { BannerNotFoundException } from '@src/banner/exception/BannerNotFoundException';

@Injectable()
export class AdminBannerService {
  constructor(private readonly bannerRepository: AdminBannerRepository) {}

  async getAllBanners() {
    return await this.bannerRepository.findAll();
  }

  async createBanner(createBannerRequest: CreateBannerRequest) {
    return this.bannerRepository.save(createBannerRequest);
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
      throw new BannerNotFoundException(id);
    }

    return this.bannerRepository.findOne({ where: { id } });
  }

  async updateInfo(id: number, updateDetailsRequest: UpdateBannerInfoRequest) {
    const result = await this.bannerRepository.update(id, {
      imageUrl: updateDetailsRequest.imageUrl,
      redirectUrl: updateDetailsRequest.redirectUrl,
    });

    if (result.affected === 0) {
      throw new BannerNotFoundException(id);
    }

    return this.bannerRepository.findOne({ where: { id } });
  }

  async deleteBanner(id: number) {
    const result = await this.bannerRepository.softDelete(id);

    if (result.affected === 0) {
      throw new BannerNotFoundException(id);
    }

    return { deleted: id };
  }
}
