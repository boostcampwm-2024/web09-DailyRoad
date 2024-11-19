import { Place } from '../entity/place.entity';

export class PlaceListResponse {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly location: {
      readonly latitude: number;
      readonly longitude: number;
    },
    readonly google_place_id: string,
    readonly category?: string,
    readonly description?: string,
    readonly detail_page_url?: string,
    readonly thumbnail_url?: string,
    readonly rating?: number,
    readonly formed_address?: string,
  ) {}

  static from(place: Place): PlaceListResponse {
    return new PlaceListResponse(
      place.id,
      place.name,
      {
        latitude: place.latitude,
        longitude: place.longitude,
      },
      place.googlePlaceId,
      place.category,
      place.description,
      place.detailPageUrl,
      place.thumbnailUrl,
      place.rating,
      place.formattedAddress,
    );
  }
}
