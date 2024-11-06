import { UserIconResponse } from '../../user/dto/UserIconResponse';
import { PlaceResponse } from '../../place/dto/PlaceResponse';
import { DEFAULT_THUMBNAIL_URL } from './CourseListResponse';
import { Course } from '../entity/course.entity';

export class CourseDetailResponse {
  constructor(
    readonly id: number,
    readonly user: { id: number; nickname: string; profileImageUrl: string },
    readonly title: string,
    readonly isPublic: boolean,
    readonly thumbnailUrl: string,
    readonly description: string,
    readonly pinCount: number,
    readonly places: PlaceResponse[],
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static async from(course: Course) {
    const places = (await course.getPlacesWithComment()).map((place, index) => {
      return {
        ...PlaceResponse.from(place.place),
        comment: place.comment,
        order: index + 1,
      };
    });

    return new CourseDetailResponse(
      course.id,
      UserIconResponse.from(course.user),
      course.title,
      course.isPublic,
      course.thumbnailUrl ?? DEFAULT_THUMBNAIL_URL,
      course.description ?? '',
      course.pinCount,
      places,
      course.createdAt,
      course.updatedAt,
    );
  }
}
