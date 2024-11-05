import { Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { CreatePlaceDto } from './dto/CreatePlaceDto';
import { Place } from './place.entity';
import { PlaceNotFoundException } from './exception/PlaceNotFoundException';
import { PlaceAlreadyExistsException } from './exception/PlaceAlreadyExistsException';

@Injectable()
export class PlaceService {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async addPlace(createPlaceDto: CreatePlaceDto) {
    const {
      googlePlaceId,
      name,
      thumbnailUrl,
      rating,
      location: { longitude, latitude },
      formattedAddress,
      description,
      detailPageUrl,
    } = createPlaceDto;

    const place = new Place();
    place.googlePlaceId = googlePlaceId;
    place.name = name;
    place.thumbnailUrl = thumbnailUrl;
    place.rating = rating;
    place.longitude = longitude;
    place.latitude = latitude;
    place.formattedAddress = formattedAddress;
    place.description = description;
    place.detailPageUrl = detailPageUrl;

    if (await this.placeRepository.findByGooglePlaceId(googlePlaceId)) {
      throw new PlaceAlreadyExistsException();
    }

    const savedPlace = await this.placeRepository.save(place);
    return { id: savedPlace.id };
  }

  async getPlaces(query: string) {
    if (query) {
      const result = await this.placeRepository.searchNameByQuery(query);
      if (result.length === 0) {
        throw new PlaceNotFoundException();
      }
      return result;
    }
    return this.placeRepository.findAll();
  }

  async getPlace(id: number) {
    return this.placeRepository.findById(id);
  }
}
