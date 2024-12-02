import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { CourseRepository } from '@src/course/CourseRepository';
import { CourseListResponse } from '@src/course/dto/CourseListResponse';
import {
  CourseDetailResponse,
  getPlacesResponseOfCourseWithOrder,
} from '@src/course/dto/CourseDetailResponse';
import { PagedCourseResponse } from '@src/course/dto/PagedCourseResponse';
import { CreateCourseRequest } from '@src/course/dto/CreateCourseRequest';
import { UpdateCourseInfoRequest } from '@src/course/dto/UpdateCourseInfoRequest';
import { UpdatePinsOfCourseRequest } from '@src/course/dto/AddPlaceToCourseRequest';
import { CourseNotFoundException } from '@src/course/exception/CourseNotFoundException';
import { PlaceRepository } from '@src/place/PlaceRepository';
import { InvalidPlaceToCourseException } from '@src/course/exception/InvalidPlaceToCourseException';
import { User } from '@src/user/entity/User';
import { UpdateCourseVisibilityRequest } from '@src/course/dto/UpdateCourseVisibilityRequest';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly placeRepository: PlaceRepository,
  ) {}

  // Todo. 작성자명 등 ... 검색 조건 추가
  async searchPublicCourses(
    query?: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const [searchedCourses, totalCount] = query
      ? await Promise.all([
          this.courseRepository.searchByTitleQuery(query, page, pageSize),
          this.courseRepository.countByTitleAndIsPublic(query),
        ])
      : await Promise.all([
          this.courseRepository.findAll(page, pageSize),
          this.courseRepository.countAllPublic(),
        ]);

    const courses = await Promise.all(
      searchedCourses.map(CourseListResponse.from),
    );
    return new PagedCourseResponse(courses, totalCount, page, pageSize);
  }

  async getMyCourses(userId: number, page: number = 1, pageSize: number = 10) {
    const [ownCourses, totalCount] = await Promise.all([
      this.courseRepository.findByUserId(userId, page, pageSize),
      this.courseRepository.countByUserId(userId),
    ]);

    const courses = await Promise.all(ownCourses.map(CourseListResponse.from));
    return new PagedCourseResponse(courses, totalCount, page, pageSize);
  }

  async getCourse(id: number) {
    const course = await this.getCourseOrElseThrowNotFound(id);

    return await CourseDetailResponse.from(course);
  }

  async getCourseOwnerId(courseId: number) {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new CourseNotFoundException(courseId);

    return course.user.id;
  }

  async createCourse(userId: number, createCourseForm: CreateCourseRequest) {
    const user = { id: userId } as User;
    const course = createCourseForm.toEntity(user);

    return { id: (await this.courseRepository.save(course)).id };
  }

  async deleteCourse(id: number) {
    await this.validateCourseExistsById(id);

    await this.courseRepository.softDelete(id);
    return { id };
  }

  async updateInfo(id: number, updateCourseForm: UpdateCourseInfoRequest) {
    await this.validateCourseExistsById(id);
    const { title, description, thumbnailUrl } = updateCourseForm;
    return this.courseRepository.updateInfoById(
      id,
      title,
      description,
      thumbnailUrl,
    );
  }

  async updateVisibility(
    id: number,
    visibility: UpdateCourseVisibilityRequest,
  ) {
    await this.validateCourseExistsById(id);
    return this.courseRepository.updateIsPublicById(id, visibility.isPublic);
  }

  @Transactional()
  async updatePins(
    id: number,
    setPlacesOfCourseRequest: UpdatePinsOfCourseRequest,
  ) {
    const course = await this.getCourseOrElseThrowNotFound(id);

    await this.validatePlacesForCourse(
      setPlacesOfCourseRequest.places.map((p) => p.placeId),
    );

    course.setPlaces(setPlacesOfCourseRequest.places);
    await this.courseRepository.updateCoursePlaceById(course);
    const reloadedCourse = await this.courseRepository.findById(course.id);

    return {
      places: await getPlacesResponseOfCourseWithOrder(reloadedCourse),
    };
  }

  @Transactional()
  async updatePin(id: number, placeId: number, comment?: string) {
    const course = await this.getCourseOrElseThrowNotFound(id);

    course.updatePlace(placeId, comment);
    return this.courseRepository.save(course);
  }

  private async getCourseOrElseThrowNotFound(id: number) {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new CourseNotFoundException(id);
    return course;
  }

  private async validateCourseExistsById(id: number) {
    if (!(await this.courseRepository.existById(id)))
      throw new CourseNotFoundException(id);
  }

  private async validatePlacesForCourse(placeIds: number[]) {
    const notExistsPlaceIds = await Promise.all(
      placeIds.map(async (placeId) => {
        const exists = await this.placeRepository.existById(placeId);
        return exists ? null : placeId;
      }),
    );

    const invalidIds = notExistsPlaceIds.filter((placeId) => placeId !== null);
    if (invalidIds.length > 0) {
      throw new InvalidPlaceToCourseException(invalidIds);
    }
  }
}
