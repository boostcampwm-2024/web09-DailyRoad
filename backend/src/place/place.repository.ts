import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Place } from './place.entity';

@Injectable()
export class PlaceRepository {
  private placeRepository: Repository<Place>;

  constructor(private readonly datasource: DataSource) {
    this.placeRepository = this.datasource.getRepository(Place);
  }

  async save(place: Place) {
    return this.placeRepository.save(place);
  }

  async findAll() {
    return this.placeRepository.find();
  }

  async findById(id: number) {
    return this.placeRepository.findOne({ where: { id } });
  }

  async findByGooglePlaceId(googlePlaceId: string) {
    return this.placeRepository.findOne({ where: { googlePlaceId } });
  }

  async searchNameByQuery(query: string) {
    return this.placeRepository.find({
      where: { name: Like(`%${query}%`) },
    });
  }
}
