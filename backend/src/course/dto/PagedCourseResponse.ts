import { CourseListResponse } from './CourseListResponse';
import { PaginationResponse } from '../../common/dto/PaginationResponse';

export class PagedCourseResponse extends PaginationResponse {
  constructor(
    readonly courses: CourseListResponse[],
    totalCount: number,
    currentPage: number,
    pageSize: number,
  ) {
    super(totalCount, pageSize, currentPage);
  }
}