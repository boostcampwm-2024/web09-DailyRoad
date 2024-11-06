import { Injectable } from '@nestjs/common';
import { DataSource, ILike } from 'typeorm';
import { Place } from './place.entity';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';

@Injectable()
export class PlaceRepository extends SoftDeleteRepository<Place, number> {
  constructor(private readonly datasource: DataSource) {
    super(Place, datasource.createEntityManager());
  }

  async findAll(page: number, pageSize: number) {
    return this.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findByGooglePlaceId(googlePlaceId: string) {
    return this.findOne({ where: { googlePlaceId } });
  }

  async searchByNameOrAddressQuery(
    query: string,
    page: number,
    pageSize: number,
  ) {
    return this.find({
      where: [
        { formattedAddress: ILike(`%${query}%`) },
        { name: ILike(`%${query}%`) },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
