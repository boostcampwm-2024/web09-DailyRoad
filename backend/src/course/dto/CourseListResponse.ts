import { UserIconResponse } from '../../user/dto/UserIconResponse';
import { Course } from '../course.entity';

// Todo. 오브젝트 스토리지에 실제 이미지 저장 후 수정
export const DEFAULT_THUMBNAIL_URL =
  'https://avatars.githubusercontent.com/u/87180146?v=4';

export class CourseListResponse {
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

  static async from(map: Course) {
    return new CourseListResponse(
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
