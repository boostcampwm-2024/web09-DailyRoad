import { UserIconResponse } from '@src/user/dto/UserIconResponse';
import { Course } from '../entity/course.entity';

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

  static async from(course: Course) {
    return new CourseListResponse(
      course.id,
      UserIconResponse.from(course.user),
      course.title,
      course.isPublic,
      course.thumbnailUrl ?? Course.DEFAULT_THUMBNAIL_URL,
      course.description ?? '',
      course.pinCount,
      course.createdAt,
      course.updatedAt,
    );
  }
}
