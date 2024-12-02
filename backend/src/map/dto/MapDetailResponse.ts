import { Map } from '@src/map/entity/Map';
import { UserIconResponse } from '@src/user/dto/UserIconResponse';
import { PlaceListResponse } from '@src/place/dto/PlaceListResponse';
import { DEFAULT_THUMBNAIL_URL } from '@src/common/consts';

export class MapDetailResponse {
  constructor(
    readonly id: number,
    readonly user: { id: number; nickname: string; profileImageUrl: string },
    readonly title: string,
    readonly isPublic: boolean,
    readonly thumbnailUrl: string,
    readonly description: string,
    readonly pinCount: number,
    readonly places: PlaceListResponse[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static async from(map: Map) {
    const places = (await map.getPinsWithComment()).map((place) => {
      return {
        ...PlaceListResponse.from(place.place),
        comment: place.comment,
        color: place.color,
      };
    });

    return new MapDetailResponse(
      map.id,
      UserIconResponse.from(map.user),
      map.title,
      map.isPublic,
      map.thumbnailUrl ?? DEFAULT_THUMBNAIL_URL,
      map.description ?? '',
      map.pinCount,
      places,
      map.createdAt,
      map.updatedAt,
    );
  }
}
