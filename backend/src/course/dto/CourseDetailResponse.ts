import { UserIconResponse } from '@src/user/dto/UserIconResponse';
import { PlaceListResponse } from '@src/place/dto/PlaceListResponse';
import { Course } from '@src/course/entity/Course';

export class CourseDetailResponse {
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

  static async from(course: Course) {
    const places = await getPlacesResponseOfCourseWithOrder(course);

    return new CourseDetailResponse(
      course.id,
      UserIconResponse.from(course.user),
      course.title,
      course.isPublic,
      course.thumbnailUrl ?? Course.DEFAULT_THUMBNAIL_URL,
      course.description ?? '',
      course.pinCount,
      places,
      course.createdAt,
      course.updatedAt,
    );
  }
}

export async function getPlacesResponseOfCourseWithOrder(course: Course) {
  return (await course.getPlacesWithComment()).map((place, index) => {
    return {
      ...PlaceListResponse.from(place.place),
      comment: place.comment,
      order: index + 1,
    };
  });
}
