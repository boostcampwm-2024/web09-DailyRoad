import { CourseListResponse } from './CourseListResponse';

export class OwnCourseListResponse {
  constructor(
    readonly courses: CourseListResponse[],
    readonly totalPages: number,
    readonly currentPage: number,
  ) {}
}
