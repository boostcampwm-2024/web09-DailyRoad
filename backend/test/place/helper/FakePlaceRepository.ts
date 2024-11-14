import { Injectable } from '@nestjs/common';
import { Place } from '../../../src/place/entity/place.entity';
import { FakeSoftDeleteRepository } from '../../common/helper/FakeSoftDeleteRepository';

@Injectable()
export class FakePlaceRepository extends FakeSoftDeleteRepository<Place, number> {
  private places: Place[] = [];

  async findAll(page: number, pageSize: number): Promise<Place[]> {
    const start = (page - 1) * pageSize;
    return this.places.slice(start, start + pageSize);
  }
l
  async findByGooglePlaceId(googlePlaceId: string): Promise<Place | undefined> {
    return this.places.find(place => place.googlePlaceId === googlePlaceId);
  }

  async searchByNameOrAddressQuery(query: string, page: number, pageSize: number): Promise<Place[]> {
    const result = this.places.filter(
      place =>
        place.formattedAddress.includes(query) || place.name.includes(query),
    );
    const start = (page - 1) * pageSize;
    return result.slice(start, start + pageSize);
  }

  async save(place: Place): Promise<Place> {
    this.places.push(place);
    return place;
  }

  async softDelete(id: number): Promise<void> {
    const index = this.places.findIndex(place => place.id === id);
    if (index > -1) {
      this.places[index].deletedAt = new Date();
    }
  }

  async existById(id: number): Promise<boolean> {
    return this.places.some(place => place.id === id && !place.deletedAt);
  }
}
