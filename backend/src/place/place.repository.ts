import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Place } from './place.entity';
import { CreatePlaceDto } from './dto/CreatePlaceDto';

@Injectable()
export class PlaceRepository {
  private placeRepository: Repository<Place>;

  constructor(private readonly datasource: DataSource) {
    this.placeRepository = this.datasource.getRepository(Place);
  }

  async save(createPlaceDto: CreatePlaceDto) {
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

    return this.placeRepository.save(place);
  }
}
