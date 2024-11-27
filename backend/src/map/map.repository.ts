import { Injectable } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { Map } from './entity/map.entity';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';

@Injectable()
export class MapRepository extends SoftDeleteRepository<Map, number> {
  constructor(private dataSource: DataSource) {
    super(Map, dataSource.createEntityManager());
  }

  findAll(page: number, pageSize: number) {
    return this.find({
      where: { isPublic: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  searchByTitleQuery(title: string, page: number, pageSize: number) {
    return this.find({
      where: { title: ILike(`%${title}%`), isPublic: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  countByTitle(title: string) {
    return this.count({
      where: { title: ILike(`%${title}%`), isPublic: true },
    });
  }

  countByUserId(userId: number) {
    return this.count({
      where: { id: userId },
    });
  }

  async findMapsWithPlace(page: number, pageSize: number) {
    return await this.createQueryBuilder('map')
      .leftJoinAndSelect('map.mapPlaces', 'mapPlace')
      .leftJoinAndSelect('map.user', 'user')
      .where('map.isPublic = :isPublic', { isPublic: true })
      .andWhere('mapPlace.id IS NOT NULL')
      .orderBy('map.createdAt', 'DESC')
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
