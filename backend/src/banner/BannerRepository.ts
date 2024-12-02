import { Injectable } from '@nestjs/common';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';
import { Banner } from './entity/Banner';
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

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
