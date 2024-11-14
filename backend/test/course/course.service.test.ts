import { CourseRepository } from '../../src/course/course.repository';
import { CourseService } from '../../src/course/course.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CourseFixture } from './fixture/course.fixture';
import { User } from '../../src/user/entity/user.entity';
import { CourseListResponse } from '../../src/course/dto/CourseListResponse';
import { PagedCourseResponse } from '../../src/course/dto/PagedCourseResponse';
import { PlaceRepository } from '../../src/place/place.repository';
import { Course } from '../../src/course/entity/course.entity';
import { CourseDetailResponse } from '../../src/course/dto/CourseDetailResponse';
import { UserIconResponse } from '../../src/user/dto/UserIconResponse';
import { CourseNotFoundException } from '../../src/course/exception/CourseNotFoundException';

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
      findById: jest.fn(),
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

  describe('코스 목록을 조회할 때', () => {
    it('검색 쿼리가 없으면 모든 공개 코스를 반환한다', async () => {
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

    it('검색 쿼리가 있으면 해당 공개 코스를 반환한다', async () => {
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

    it('비공개 코스는 조회할 수 없다', async () => {
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
      result.courses.forEach((course) =>
        expect(course.isPublic).not.toBeFalsy(),
      );
    });
  });

  it('자신의 생성한 코스 목록을 조회할 수 있다', async () => {
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

  describe('특정 코스를 조회할 때', () => {
    it('성공하면 특정 코스를 조회할 수 있다', async () => {
      const course = CourseFixture.createCourse({
        user: fakeUser1,
        title: 'Course 1',
        isPublic: true,
      });
      const courseWithId = { ...course, id: 1 } as Course;
      courseRepository.findById.mockResolvedValue(courseWithId);
      jest.spyOn(CourseDetailResponse, 'from').mockResolvedValue({
        id: courseWithId.id,
        user: {
          id: fakeUser1.id,
        } as UserIconResponse,
        title: courseWithId.title,
        isPublic: courseWithId.isPublic,
      } as CourseDetailResponse);

      const result = await courseService.getCourseById(courseWithId.id);

      const expectedResponse = await CourseListResponse.from(courseWithId);
      expect(result.id).toEqual(expectedResponse.id);
      expect(result.user.id).toEqual(expectedResponse.user.id);
      expect(result.title).toEqual(expectedResponse.title);
      expect(result.isPublic).toEqual(expectedResponse.isPublic);
    });

    it('실패하면 코스를 찾을 수 없다는 예외를 던진다', async () => {
      const courseId = 1;
      courseRepository.findById.mockResolvedValue(null);

      const result = courseService.getCourseById(courseId);

      await expect(result).rejects.toThrow(CourseNotFoundException);
      await expect(result).rejects.toThrow(
        new CourseNotFoundException(courseId),
      );
    });
  });
});
