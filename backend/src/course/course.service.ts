import { Injectable } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { User } from '../user/entity/user.entity';
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
import { UserRepository } from '../user/user.repository';
import { InvalidPlaceToCourseException } from './exception/InvalidPlaceToCourseException';

@Injectable()
export class CourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly placeRepository: PlaceRepository,
    private readonly userRepository: UserRepository,
  ) {
    // Todo. 로그인 기능 완성 후 제거
    const testUser = new User('test', 'test', 'test', 'test');
    testUser.id = 1;
    userRepository.upsert(testUser, { conflictPaths: ['id'] });
  }

  // Todo. 작성자명 등 ... 검색 조건 추가
  async searchCourse(query?: string, page: number = 1, pageSize: number = 10) {
    const maps = query
      ? await this.courseRepository.searchByTitleQuery(query, page, pageSize)
      : await this.courseRepository.findAll(page, pageSize);

    const totalCount = await this.courseRepository.count({
      where: { title: query, isPublic: true },
    });

    const publicMaps = maps.filter((map) => map.isPublic);

    return {
      courses: await Promise.all(publicMaps.map(CourseListResponse.from)),
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  }

  async getOwnCourses(userId: number, page: number = 1, pageSize: number = 10) {
    // Todo. 그룹 기능 추가
    const totalCount = await this.courseRepository.count({
      where: { user: { id: userId } },
    });

    const ownMaps = await this.courseRepository.findByUserId(
      userId,
      page,
      pageSize,
    );

    return {
      courses: await Promise.all(ownMaps.map(CourseListResponse.from)),
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
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

  async createCourse(userId: number, createMapForm: CreateCourseRequest) {
    const user = { id: userId } as User;
    const map = createMapForm.toEntity(user);

    return { id: (await this.courseRepository.save(map)).id };
  }

  async deleteCourse(id: number) {
    await this.checkExists(id);

    await this.courseRepository.softDelete(id);
    return { id };
  }

  async updateCourseInfo(id: number, updateMapForm: UpdateCourseInfoRequest) {
    await this.checkExists(id);

    const { title, description } = updateMapForm;
    return this.courseRepository.update(id, { title, description });
  }

  async updateCourseVisibility(id: number, isPublic: boolean) {
    await this.checkExists(id);

    return this.courseRepository.update(id, { isPublic });
  }

  private async checkExists(id: number) {
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
