import { CourseRepository } from '../../src/course/course.repository';
import { CourseService } from '../../src/course/course.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CourseFixture } from './fixture/course.fixture';
import { User } from '../../src/user/entity/user.entity';
import { CourseListResponse } from '../../src/course/dto/CourseListResponse';
import { PagedCourseResponse } from '../../src/course/dto/PagedCourseResponse';
import { PlaceRepository } from '../../src/place/place.repository';
import { Course } from '../../src/course/entity/course.entity';
import { CourseNotFoundException } from '../../src/course/exception/CourseNotFoundException';
import { CreateCourseRequest } from '../../src/course/dto/CreateCourseRequest';
import { UpdateCourseInfoRequest } from '../../src/course/dto/UpdateCourseInfoRequest';

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
      existById: jest.fn(),
      softDelete: jest.fn(),
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
      courseWithId.getPlacesWithComment = jest.fn().mockResolvedValue([]);

      const result = await courseService.getCourseById(courseWithId.id);

      expect(result.id).toEqual(courseWithId.id);
      expect(result.title).toEqual(courseWithId.title);
      expect(result.isPublic).toEqual(courseWithId.isPublic);
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

  describe('특정 코스의 소유자를 조회할 때', () => {
    it('성공하면 특정 코스의 소유자의 id를 조회할 수 있다', async () => {
      const course = CourseFixture.createCourse({
        user: fakeUser1,
        title: 'Course 1',
        isPublic: true,
      });
      const courseWithId = { ...course, id: 1 } as Course;
      courseRepository.findById.mockResolvedValue(courseWithId);

      const result = await courseService.getCourseOwnerId(courseWithId.id);

      expect(result).toEqual(fakeUser1.id);
    });

    it('실패하면 코스를 찾을 수 없다는 예외를 던진다', async () => {
      const courseId = 1;
      courseRepository.findById.mockResolvedValue(null);

      const result = courseService.getCourseOwnerId(courseId);

      await expect(result).rejects.toThrow(CourseNotFoundException);
      await expect(result).rejects.toThrow(
        new CourseNotFoundException(courseId),
      );
    });
  });

  it('코스를 생성할 수 있다', async () => {
    const createCourseForm = {
      title: 'My Course',
      isPublic: true,
      thumbnailUrl: 'https://example.com/course_thumbnail.jpg',
      description: 'A sample course with popular places',
    };
    const course = CourseFixture.createCourse({
      user: fakeUser1,
      ...createCourseForm,
    });
    course.id = 1;
    courseRepository.save.mockResolvedValue(course);

    const result = await courseService.createCourse(
      fakeUser1.id,
      CreateCourseRequest.from(createCourseForm),
    );

    expect(result.id).toEqual(course.id);
  });

  describe('코스를 삭제할 때', () => {
    it('코스가 존재하면 삭제할 수 있다', async () => {
      const courseId = 1;
      courseRepository.existById.mockResolvedValue(true);

      const result = await courseService.deleteCourse(courseId);

      expect(result.id).toEqual(courseId);
    });
    it('코스가 존재하지 않으면 예외를 던진다', async () => {
      const courseId = 1;
      courseRepository.existById.mockResolvedValue(false);

      const result = courseService.deleteCourse(courseId);

      await expect(result).rejects.toThrow(CourseNotFoundException);
      await expect(result).rejects.toThrow(
        new CourseNotFoundException(courseId),
      );
    });
  });

  it('코스 정보를 수정할 때 코스가 존재하지 않으면 예외를 던진다', async () => {
    const courseId = 1;
    const updateCourseForm = {
      title: 'My Course',
      description: 'A sample course with popular places',
      thumbnailUrl: 'https://example.com/course_thumbnail.jpg',
    } as UpdateCourseInfoRequest;
    courseRepository.existById.mockResolvedValue(false);

    const result = courseService.updateCourseInfo(courseId, updateCourseForm);

    await expect(result).rejects.toThrow(CourseNotFoundException);
    await expect(result).rejects.toThrow(new CourseNotFoundException(courseId));
  });

  it('코스 공개/비공개 여부를 수정할 때 코스가 존재하지 않으면 예외를 던진다', async () => {
    const courseId = 1;
    const isPublic = true;
    courseRepository.existById.mockResolvedValue(false);

    const result = courseService.updateCourseVisibility(courseId, isPublic);

    await expect(result).rejects.toThrow(CourseNotFoundException);
    await expect(result).rejects.toThrow(new CourseNotFoundException(courseId));
  });
});
