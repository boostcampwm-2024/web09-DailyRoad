import { Injectable } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { Map } from './entity/map.entity';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';
import { sortOrder } from '@src/map/map.type';

@Injectable()
export class MapRepository extends SoftDeleteRepository<Map, number> {
  constructor(private dataSource: DataSource) {
    super(Map, dataSource.createEntityManager());
  }

  findAll(page: number, pageSize: number, orderBy: sortOrder) {
    return this.find({
      where: { isPublic: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: orderBy,
      },
    });
  }

  searchByTitleQuery(
    title: string,
    page: number,
    pageSize: number,
    orderBy: sortOrder,
  ) {
    return this.find({
      where: { title: ILike(`%${title}%`), isPublic: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: orderBy,
      },
    });
  }

  async findMapWithPlace(page: number, pageSize: number, orderBy: sortOrder) {
    return await this.createQueryBuilder('map')
      .leftJoinAndSelect('map.mapPlaces', 'mapPlace')
      .leftJoinAndSelect('map.user', 'user')
      .where('map.isPublic = :isPublic', { isPublic: true })
      .andWhere('mapPlace.id IS NOT NULL')
      .orderBy('map.createdAt', orderBy)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
  }

  async countMapsWithPlace() {
    return await this.createQueryBuilder('map')
      .leftJoinAndSelect('map.mapPlaces', 'mapPlace')
      .where('map.isPublic = :isPublic', { isPublic: true })
      .andWhere('mapPlace.id IS NOT NULL')
      .getCount();
  }

  findByUserId(userId: number, page: number, pageSize: number) {
    return this.find({
      where: { user: { id: userId } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
