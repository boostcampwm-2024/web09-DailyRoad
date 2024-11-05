import { Repository, DataSource, ILike, FindManyOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Map } from './entity/map.entity';

@Injectable()
export class MapRepository extends Repository<Map> {
  constructor(private dataSource: DataSource) {
    super(Map, dataSource.createEntityManager());
  }

  find(options: FindManyOptions<Map> = {}) {
    return super.find({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: null,
      },
    });
  }

  findAll(page: number, pageSize: number) {
    return this.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  findAndCount(options: FindManyOptions<Map> = {}) {
    return super.findAndCount({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: null,
      },
    });
  }

  count(options: FindManyOptions<Map> = {}): Promise<number> {
    return super.count({
      ...options,
      where: {
        ...(options?.where || {}),
        deletedAt: null,
      },
    });
  }

  findById(id: number) {
    return this.findOne({
      where: {
        id,
        deletedAt: null,
      },
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

  softDelete(id: number) {
    return super.update(id, { deletedAt: new Date() });
  }
}
