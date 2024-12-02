import { AddPlaceRequest } from '@src/place/dto/AddPlaceRequest';
import { Category } from '@src/place/enum/Category';

export class PlaceCreateRequestFixture {
  static default = {
    googlePlaceId: 'googlePlaceId_1',
    name: 'Central Park',
    rating: 4.5,
    location: {
      longitude: -73.965355,
      latitude: 40.782865,
    },
    formattedAddress: 'New York, NY, USA',
    category: Category.명소,
    description: 'A large public park in New York City.',
    detailPageUrl: 'https://example.com/central_park',
    thumbnailUrl: 'https://example.com/central_park.jpg',
    photoReference: 'photoReference',
  };

  static create(
    customValues: Partial<AddPlaceRequest> = {},
  ): AddPlaceRequest {
    const request = new AddPlaceRequest();
    const mergedValues = { ...this.default, ...customValues };

    request.googlePlaceId = mergedValues.googlePlaceId;
    request.name = mergedValues.name;
    request.rating = mergedValues.rating;
    request.location = mergedValues.location;
    request.formattedAddress = mergedValues.formattedAddress;
    request.category = mergedValues.category;
    request.description = mergedValues.description;
    request.detailPageUrl = mergedValues.detailPageUrl;
    request.thumbnailUrl = mergedValues.thumbnailUrl;
    request.photoReference = mergedValues.photoReference;

    return request;
  }
}
