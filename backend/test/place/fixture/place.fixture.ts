import { Place } from '@src/place/entity/place.entity';
import { PlaceFixtureType } from './place.fixture.type';

export class PlaceFixture {
  static createPlace = ({
    googlePlaceId = 'googlePlaceId_1',
    name = 'Central Park',
    imageUrl = 'https://example.com/central_park.jpg',
    rating = 4.5,
    longitude = -73.965355,
    latitude = 40.782865,
    formattedAddress = 'New York, NY, USA',
    description = 'A large public park in New York City.',
    url = 'https://example.com/central_park',
  }: PlaceFixtureType) => {
    return new Place(
      googlePlaceId,
      name,
      imageUrl,
      rating,
      longitude,
      latitude,
      formattedAddress,
      description,
      url,
    );
  };
}
