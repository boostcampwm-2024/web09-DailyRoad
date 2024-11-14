import { CourseRepository } from '../../src/course/course.repository';
import { CourseService } from '../../src/course/course.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CourseFixture } from './fixture/course.fixture';
import { User } from '../../src/user/entity/user.entity';
import { CourseListResponse } from '../../src/course/dto/CourseListResponse';
import { PagedCourseResponse } from '../../src/course/dto/PagedCourseResponse';
import { PlaceRepository } from '../../src/place/place.repository';

describe('CourseService', () => {
  let courseService: CourseService;
  let courseRepository: Partial<Record<keyof CourseRepository, jest.Mock>>;
  let placeRepository: Partial<Record<keyof PlaceRepository, jest.Mock>>;
  let fakeUser1: User;

  beforeAll(async () => {
    fakeUser1 = { id: 1 } as User;
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

    const page = 1;
    const pageSize = 10;
    const result = await courseService.searchPublicCourses(
      null,
      page,
      pageSize,
    );

    const expectedCourses = await Promise.all(
      publicCourses.map(CourseListResponse.from),
    );
    const expectedResponse = new PagedCourseResponse(
      expectedCourses,
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
        user: { id: 1 } as User,
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

    const page = 1;
    const pageSize = 10;
    const query = 'Food';
    const result = await courseService.searchPublicCourses(
      query,
      page,
      pageSize,
    );

    const expectedCourses = await Promise.all(
      publicCoursesWithFood.map(CourseListResponse.from),
    );
    const expectedResponse = new PagedCourseResponse(
      expectedCourses,
      publicCoursesWithFood.length,
      page,
      pageSize,
    );
    expect(result).toEqual(expectedResponse);
  });
});
