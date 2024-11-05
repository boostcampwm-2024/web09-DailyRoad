import { Injectable } from '@nestjs/common';
import { ILike, DataSource } from 'typeorm';
import { Map } from './entity/map.entity';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';

@Injectable()
export class MapRepository extends SoftDeleteRepository<Map, number> {
  constructor(private dataSource: DataSource) {
    super(Map, dataSource.createEntityManager());
  }

  findAll(page: number, pageSize: number) {
    return this.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  searchByTitleQuery(title: string, page: number, pageSize: number) {
    return this.find({
      where: { title: ILike(`%${title}%`), isPublic: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findByUserId(userId: number, page: number, pageSize: number) {
    return this.find({
      where: { user: { id: userId }, deletedAt: null },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
