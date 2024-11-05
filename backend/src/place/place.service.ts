import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { CreatePlaceDto } from './dto/CreatePlaceDto';

@Injectable()
export class PlaceService {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async addPlace(createPlaceDto: CreatePlaceDto) {
    const savedPlace = await this.placeRepository.save(createPlaceDto);
    return { id: savedPlace.id };
  }

  async getPlaces() {
    return this.placeRepository.findAll();
  }
}
