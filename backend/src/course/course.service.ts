import { Injectable } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CreateCourseRequest } from './dto/CreateCourseRequest';
import { CourseListResponse } from './dto/CourseListResponse';
import {
  CourseDetailResponse,
  getPlacesResponseOfCourseWithOrder,
} from './dto/CourseDetailResponse';
import { CourseNotFoundException } from './exception/CourseNotFoundException';
import { UpdateCourseInfoRequest } from './dto/UpdateCourseInfoRequest';
import { SetPlacesOfCourseRequest } from './dto/AddPlaceToCourseRequest';
import { PlaceRepository } from '../place/place.repository';
import { InvalidPlaceToCourseException } from './exception/InvalidPlaceToCourseException';
import { PagedCourseResponse } from './dto/PagedCourseResponse';
import { User } from '../user/entity/user.entity';

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

  // Todo. 그룹 기능 추가
  async getOwnCourses(userId: number, page: number = 1, pageSize: number = 10) {
    const [ownCourses, totalCount] = await Promise.all([
      this.courseRepository.findByUserId(userId, page, pageSize),
      this.courseRepository.countByUserId(userId),
    ]);

    const courses = await Promise.all(ownCourses.map(CourseListResponse.from));
    return new PagedCourseResponse(courses, totalCount, page, pageSize);
  }

  async getCourseById(id: number) {
    const map = await this.courseRepository.findById(id);
    if (!map) throw new CourseNotFoundException(id);

    return await CourseDetailResponse.from(map);
  }

  async getCourseOwnerId(courseId: number) {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new CourseNotFoundException(courseId);

    return course.user.id;
  }

  async createCourse(userId: number, createCourseForm: CreateCourseRequest) {
    const user = { id: userId } as User;
    const map = createCourseForm.toEntity(user);

    return { id: (await this.courseRepository.save(map)).id };
  }

  async deleteCourse(id: number) {
    await this.validateCourseExistsById(id);

    await this.courseRepository.softDelete(id);
    return { id };
  }

  async updateCourseInfo(id: number, updateMapForm: UpdateCourseInfoRequest) {
    await this.validateCourseExistsById(id);
    const { title, description, thumbnailUrl } = updateMapForm;
    return this.courseRepository.updateInfoById(
      id,
      title,
      description,
      thumbnailUrl,
    );
  }

  async updateCourseVisibility(id: number, isPublic: boolean) {
    await this.validateCourseExistsById(id);
    return this.courseRepository.updateIsPublicById(id, isPublic);
  }

  private async validateCourseExistsById(id: number) {
    if (!(await this.courseRepository.existById(id)))
      throw new CourseNotFoundException(id);
  }

  async setPlacesOfCourse(
    id: number,
    setPlacesOfCourseRequest: SetPlacesOfCourseRequest,
  ) {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new CourseNotFoundException(id);

    await this.validatePlacesForCourse(
      setPlacesOfCourseRequest.places.map((p) => p.placeId),
    );

    course.setPlaces(setPlacesOfCourseRequest.places);
    await this.courseRepository.save(course); // Todo. Q.바로 장소 조회하면 장소 정보가 없음.. (장소 참조만 객체에 저장했기 때문)
    const reloadedCourse = await this.courseRepository.findById(course.id);

    return {
      places: await getPlacesResponseOfCourseWithOrder(reloadedCourse),
    };
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
