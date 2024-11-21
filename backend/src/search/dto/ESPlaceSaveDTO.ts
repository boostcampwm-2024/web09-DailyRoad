import { Place } from '@src/place/entity/place.entity';

export class ESPlaceSaveDTO {
  constructor(
    readonly id: number,
    readonly googlePlaceId: string,
    readonly name: string,
    readonly thumbnailUrl: string,
    readonly rating: number,
    readonly location: {
      lat: number;
      lon: number;
    },
    readonly formattedAddress: string,
    readonly category: string,
    readonly description: string,
    readonly detailPageUrl: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly deletedAt: Date,
  ) {}

  static from(place: Place) {
    return new ESPlaceSaveDTO(
      place.id,
      place.googlePlaceId,
      place.name,
      place.thumbnailUrl,
      place.rating,
      {
        lat: place.latitude,
        lon: place.longitude,
      },
      place.formattedAddress,
      place.category,
      place.description,
      place.detailPageUrl,
      place.createdAt,
      place.updatedAt,
      place.deletedAt,
    );
  }
}
