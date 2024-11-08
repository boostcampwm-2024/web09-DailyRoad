import { Place } from '../entity/place.entity';

export class PlaceSearchResponse {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly location: {
      readonly lat: number;
      readonly lng: number;
    },
    readonly google_place_id: string,
    readonly category?: string,
    readonly description?: string,
    readonly detail_page_url?: string,
    readonly thumbnail_url?: string,
    readonly rating?: number,
    readonly formed_address?: string,
  ) {}

  static from(place: Place): PlaceSearchResponse {
    return new PlaceSearchResponse(
      place.id,
      place.name,
      {
        lat: place.latitude,
        lng: place.longitude,
      },
      place.googlePlaceId,
      place.detailPageUrl,
      place.thumbnailUrl,
      place.category,
      place.description,
      place.rating,
      place.formattedAddress,
    );
  }
}
