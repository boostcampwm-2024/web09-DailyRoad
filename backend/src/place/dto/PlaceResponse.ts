import { Place } from '../place.entity';

export class PlaceResponse {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly location: {
      readonly lat: number;
      readonly lng: number;
    },
    readonly google_place_id: string,
    readonly detail_page_url?: string,
    readonly thumbnail_url?: string,
    readonly rating?: number,
    readonly formed_address?: string,
  ) {}

  static from(place: Place): PlaceResponse {
    return new PlaceResponse(
      place.id,
      place.name,
      {
        lat: place.latitude,
        lng: place.longitude,
      },
      place.googlePlaceId,
      place.detailPageUrl,
      place.thumbnailUrl,
      place.rating,
      place.formattedAddress,
    );
  }
}
