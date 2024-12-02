import { Map } from '../entity/Map';
import { UserIconResponse } from '@src/user/dto/UserIconResponse';
import { DEFAULT_THUMBNAIL_URL } from '@src/common/consts';

export class MapListResponse {
  constructor(
    readonly id: number,
    readonly user: { id: number; nickname: string; profileImageUrl: string },
    readonly title: string,
    readonly isPublic: boolean,
    readonly thumbnailUrl: string,
    readonly description: string,
    readonly pinCount: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static async from(map: Map) {
    return new MapListResponse(
      map.id,
      UserIconResponse.from(map.user),
      map.title,
      map.isPublic,
      map.thumbnailUrl ?? DEFAULT_THUMBNAIL_URL,
      map.description ?? '',
      map.pinCount,
      map.createdAt,
      map.updatedAt,
    );
  }
}
