import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Banner } from '../../banner/entity/banner.entity';
import { SoftDeleteRepository } from '../../common/SoftDeleteRepository';

@Injectable()
export class AdminBannerRepository extends SoftDeleteRepository<
  Banner,
  number
> {
  constructor(private dataSource: DataSource) {
    super(Banner, dataSource.createEntityManager());
  }

  findAll() {
    return this.find();
  }
}
