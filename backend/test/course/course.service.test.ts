import { CourseRepository } from '../../src/course/course.repository';
import { CourseService } from '../../src/course/course.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CourseFixture } from './fixture/course.fixture';
import { User } from '../../src/user/entity/user.entity';
import { CourseListResponse } from '../../src/course/dto/CourseListResponse';
import { PagedCourseResponse } from '../../src/course/dto/PagedCourseResponse';
import { PlaceRepository } from '../../src/place/place.repository';
import { Course } from '../../src/course/entity/course.entity';

async function createPagedResponse(
  courses: Course[],
  totalCount: number,
  page: number,
  pageSize: number,
) {
  const courseList = await Promise.all(courses.map(CourseListResponse.from));
  return new PagedCourseResponse(courseList, totalCount, page, pageSize);
}

describe('CourseService', () => {
  let courseService: CourseService;
  let courseRepository: Partial<jest.Mocked<CourseRepository>>;
  let placeRepository: Partial<jest.Mocked<PlaceRepository>>;
  let fakeUser1: User;
  let page: number;
  let pageSize: number;
  let foodQuery: string;

  beforeAll(async () => {
    fakeUser1 = { id: 1 } as User;
    page = 1;
    pageSize = 10;
    foodQuery = 'Food';
  });

  beforeEach(async () => {
    courseRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      searchByTitleQuery: jest.fn(),
      countAllPublic: jest.fn(),
      countByTitleAndIsPublic: jest.fn(),
      countByUserId: jest.fn(),
      updateIsPublicById: jest.fn(),
      updateInfoById: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: CourseRepository,
          useValue: courseRepository,
        },
        {
          provide: PlaceRepository,
          useValue: placeRepository,
        },
      ],
    }).compile();
    courseService = module.get<CourseService>(CourseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('검색 쿼리가 없을 때 모든 공개 코스를 반환한다', async () => {
    const publicCourses = [
      { title: 'Public Course 1', isPublic: true },
      { title: 'Public Course 2', isPublic: true },
    ].map(({ title, isPublic }) =>
      CourseFixture.createCourse({
        user: fakeUser1,
        title,
        isPublic,
      }),
    );
    courseRepository.findAll.mockResolvedValue(publicCourses);
    courseRepository.countAllPublic.mockResolvedValue(publicCourses.length);

    const result = await courseService.searchPublicCourses(
      null,
      page,
      pageSize,
    );

    const expectedResponse = await createPagedResponse(
      publicCourses,
      publicCourses.length,
      page,
      pageSize,
    );
    expect(result).toEqual(expectedResponse);
  });

  it('검색 쿼리가 있을 때 해당 공개 코스를 반환한다', async () => {
    const publicCoursesWithFood = [
      { title: 'Food Course 1', isPublic: true },
      { title: 'Food Course 2', isPublic: true },
    ].map(({ title, isPublic }) =>
      CourseFixture.createCourse({
        user: fakeUser1,
        title,
        isPublic,
      }),
    );
    courseRepository.searchByTitleQuery.mockResolvedValue(
      publicCoursesWithFood,
    );
    courseRepository.countByTitleAndIsPublic.mockResolvedValue(
      publicCoursesWithFood.length,
    );

    const result = await courseService.searchPublicCourses(
      foodQuery,
      page,
      pageSize,
    );

    const expectedResponse = await createPagedResponse(
      publicCoursesWithFood,
      publicCoursesWithFood.length,
      page,
      pageSize,
    );
    expect(result).toEqual(expectedResponse);
  });

  it('코스 목록을 조회할 때 비공개 코스를 조회할 수 없다', async () => {
    const publicCoursesWithFood = [
      { title: 'Public Food Course 1', isPublic: true },
      { title: 'Public Food Course 2', isPublic: true },
    ].map(({ title, isPublic }) =>
      CourseFixture.createCourse({
        user: fakeUser1,
        title,
        isPublic,
      }),
    );
    courseRepository.searchByTitleQuery.mockResolvedValue(
      publicCoursesWithFood,
    );
    courseRepository.countByTitleAndIsPublic.mockResolvedValue(
      publicCoursesWithFood.length,
    );

    const result = await courseService.searchPublicCourses(
      foodQuery,
      page,
      pageSize,
    );

    const expectedResponse = await createPagedResponse(
      publicCoursesWithFood,
      publicCoursesWithFood.length,
      page,
      pageSize,
    );
    expect(result).toEqual(expectedResponse);
    result.courses.forEach((course) => expect(course.isPublic).not.toBeFalsy());
  });

  it('사용자는 자신의 코스를 조회할 수 있다', async () => {
    const ownCourses = [
      { title: 'My Course 1', isPublic: true },
      { title: 'My Course 2', isPublic: true },
    ].map(({ title, isPublic }) =>
      CourseFixture.createCourse({
        user: fakeUser1,
        title,
        isPublic,
      }),
    );
    courseRepository.findByUserId.mockResolvedValue(ownCourses);
    courseRepository.countByUserId.mockResolvedValue(ownCourses.length);

    const result = await courseService.getOwnCourses(
      fakeUser1.id,
      page,
      pageSize,
    );

    const expectedResponse = await createPagedResponse(
      ownCourses,
      ownCourses.length,
      page,
      pageSize,
    );
    expect(result).toEqual(expectedResponse);
  });
});
