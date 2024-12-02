import { Injectable } from '@nestjs/common';
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SoftDeleteRepository } from '@src/common/SoftDeleteRepository';
import { Banner } from '@src/banner/entity/Banner';

@Injectable()
export class BannerRepository extends SoftDeleteRepository<Banner, number> {
  constructor(private dataSource: DataSource) {
    super(Banner, dataSource.createEntityManager());
  }

  findAllActive() {
    const today = new Date();
    return this.find({
      where: {
        startedAt: LessThanOrEqual(today),
        endedAt: MoreThanOrEqual(today),
      },
      order: {
        startedAt: 'ASC',
      },
    });
  }
}
