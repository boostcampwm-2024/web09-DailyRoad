import { Map } from '../entity/map.entity';
import { UserIconResponse } from '../../user/dto/UserIconResponse';
import { PlaceResponse } from '../../place/dto/PlaceResponse';
import { DEFAULT_THUMBNAIL_URL } from './MapListResponse';


export class MapDetailResponse {
  constructor(
    readonly id: number,
    readonly user: { id: number, nickname: string, profileImageUrl: string },
    readonly title: string,
    readonly isPublic: boolean,
    readonly thumbnailUrl: string,
    readonly description: string,
    readonly pinCount: number,
    readonly places: PlaceResponse[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
  }

  static async from(map: Map) {
    const places = (await map.getPlaces()).map((place) => {
      return PlaceResponse.from(place);
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
