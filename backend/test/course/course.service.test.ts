import { CourseRepository } from '@src/course/CourseRepository';
import { CourseService } from '@src/course/CourseService';
import { CourseFixture } from '@test/course/fixture/course.fixture';
import { User } from '@src/user/entity/User';
import { CourseListResponse } from '@src/course/dto/CourseListResponse';
import { PagedCourseResponse } from '@src/course/dto/PagedCourseResponse';
import { PlaceRepository } from '@src/place/PlaceRepository';
import { Course } from '@src/course/entity/Course';
import { CourseNotFoundException } from '@src/course/exception/CourseNotFoundException';
import { CreateCourseRequest } from '@src/course/dto/CreateCourseRequest';
import { UpdateCourseInfoRequest } from '@src/course/dto/UpdateCourseInfoRequest';
import {
  UpdatePinsOfCourseRequest,
  UpdatePinsOfCourseRequestItem,
} from '@src/course/dto/UpdatePinsOfCourseRequest';
import { InvalidPlaceToCourseException } from '@src/course/exception/InvalidPlaceToCourseException';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { initDataSource } from '@test/config/datasource.config';
import { CoursePlace } from '@src/course/entity/CoursePlace';
import { DataSource, Repository } from 'typeorm';
import { UserFixture } from '@test/user/fixture/user.fixture';
import { PlaceFixture } from '@test/place/fixture/place.fixture';
import { truncateTables } from '@test/config/utils';
import { UpdateCourseVisibilityRequest } from '@src/course/dto/UpdateCourseVisibilityRequest';

async function createPagedResponse(
  courses: Course[],
  totalCount: number,
  currentPage: number,
  pageSize: number,
) {
  const courseList = await Promise.all(courses.map(CourseListResponse.from));
  return new PagedCourseResponse(courseList, totalCount, currentPage, pageSize);
}

describe('CourseService', () => {
  let container: StartedMySqlContainer;
  let dataSource: DataSource;
  let courseService: CourseService;
  let placeRepository: PlaceRepository;
  let courseRepository: CourseRepository;
  let coursePlaceRepository: Repository<CoursePlace>;
  let fakeUser1: User;
  let currentPage: number;
  let pageSize: number;
  let foodQuery: string;

  beforeAll(async () => {
    initializeTransactionalContext();
    container = await new MySqlContainer().withReuse().start();
    dataSource = await initDataSource(container);
    coursePlaceRepository = dataSource.getRepository(CoursePlace);
    placeRepository = new PlaceRepository(dataSource);
    courseRepository = new CourseRepository(dataSource, coursePlaceRepository);
    courseService = new CourseService(courseRepository, placeRepository);
    currentPage = 1;
    pageSize = 10;
    foodQuery = 'Food';
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await truncateTables(dataSource);
    fakeUser1 = UserFixture.createUser({});
    await dataSource.getRepository(User).save(fakeUser1);
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
      await courseRepository.save(publicCourses);

      const result = await courseService.searchPublicCourses(
        null,
        currentPage,
        pageSize,
      );

      const expectedResponse = await createPagedResponse(
        publicCourses,
        publicCourses.length,
        currentPage,
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
      await courseRepository.save(publicCoursesWithFood);

      const result = await courseService.searchPublicCourses(
        foodQuery,
        currentPage,
        pageSize,
      );

      const expectedResponse = await createPagedResponse(
        publicCoursesWithFood,
        publicCoursesWithFood.length,
        currentPage,
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
      await courseRepository.save(publicCoursesWithFood);

      const result = await courseService.searchPublicCourses(
        foodQuery,
        currentPage,
        pageSize,
      );

      const expectedResponse = await createPagedResponse(
        publicCoursesWithFood,
        publicCoursesWithFood.length,
        currentPage,
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
    await courseRepository.save(ownCourses);

    const result = await courseService.getMyCourses(
      fakeUser1.id,
      currentPage,
      pageSize,
    );

    const expectedResponse = await createPagedResponse(
      ownCourses,
      ownCourses.length,
      currentPage,
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
      const savedCourse = await courseRepository.save(course);

      const result = await courseService.getCourse(savedCourse.id);

      expect(result.id).toEqual(savedCourse.id);
      expect(result.title).toEqual(savedCourse.title);
      expect(result.isPublic).toEqual(savedCourse.isPublic);
    });

    it('실패하면 코스를 찾을 수 없다는 예외를 던진다', async () => {
      const courseId = 1;

      const result = courseService.getCourse(courseId);

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
      const savedCourse = await courseRepository.save(course);

      const result = await courseService.getCourseOwnerId(savedCourse.id);

      expect(result).toEqual(fakeUser1.id);
    });

    it('실패하면 코스를 찾을 수 없다는 예외를 던진다', async () => {
      const courseId = 1;

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

    const result = await courseService.createCourse(
      fakeUser1.id,
      CreateCourseRequest.from(createCourseForm),
    );

    const savedCourse = await courseRepository.findById(result.id);
    expect(result.id).toEqual(savedCourse.id);
  });

  describe('코스를 삭제할 때', () => {
    it('코스가 존재하면 삭제할 수 있다', async () => {
      const course = CourseFixture.createCourse({
        user: fakeUser1,
        title: 'Course 1',
        isPublic: true,
      });
      const savedCourse = await courseRepository.save(course);

      const result = await courseService.deleteCourse(savedCourse.id);

      expect(result.id).toEqual(savedCourse.id);
    });

    it('코스가 존재하지 않으면 예외를 던진다', async () => {
      const courseId = 1;

      const result = courseService.deleteCourse(courseId);

      await expect(result).rejects.toThrow(CourseNotFoundException);
      await expect(result).rejects.toThrow(
        new CourseNotFoundException(courseId),
      );
    });
  });

  describe('코스를 수정할 때', () => {
    it('코스 정보를 수정할 때 코스가 존재하지 않으면 예외를 던진다', async () => {
      const courseId = 1;
      const updateCourseForm = {
        title: 'My Course',
        description: 'A sample course with popular places',
        thumbnailUrl: 'https://example.com/course_thumbnail.jpg',
      } as UpdateCourseInfoRequest;

      const result = courseService.updateInfo(courseId, updateCourseForm);

      await expect(result).rejects.toThrow(CourseNotFoundException);
      await expect(result).rejects.toThrow(
        new CourseNotFoundException(courseId),
      );
    });

    it('코스 공개/비공개 여부를 수정할 때 코스가 존재하지 않으면 예외를 던진다', async () => {
      const courseId = 1;

      const result = courseService.updateVisibility(courseId, {
        isPublic: true,
      } as UpdateCourseVisibilityRequest);

      await expect(result).rejects.toThrow(CourseNotFoundException);
      await expect(result).rejects.toThrow(
        new CourseNotFoundException(courseId),
      );
    });
  });

  describe('코스에 장소를 추가할 때', () => {
    const setPlacesOfCourseRequest = {
      pins: [
        {
          placeId: 1,
          comment: 'A popular place',
        },
      ] as UpdatePinsOfCourseRequestItem[],
    } as UpdatePinsOfCourseRequest;

    it('코스가 존재하지 않으면 예외를 던진다', async () => {
      const courseId = 1;

      const result = courseService.updatePins(
        courseId,
        setPlacesOfCourseRequest,
      );

      await expect(result).rejects.toThrow(CourseNotFoundException);
      await expect(result).rejects.toThrow(
        new CourseNotFoundException(courseId),
      );
    });

    it('장소가 존재하지 않으면 예외를 던진다', async () => {
      const course = CourseFixture.createCourse({
        user: fakeUser1,
        title: 'Course 1',
        isPublic: true,
      });
      const savedCourse = await courseRepository.save(course);

      const result = courseService.updatePins(
        savedCourse.id,
        setPlacesOfCourseRequest,
      );

      await expect(result).rejects.toThrow(InvalidPlaceToCourseException);
      await expect(result).rejects.toThrow(
        new InvalidPlaceToCourseException([1]),
      );
    });

    it('성공적으로 코스에 장소를 추가할 수 있다', async () => {
      const course = CourseFixture.createCourse({
        user: fakeUser1,
        title: 'Course 1',
        isPublic: true,
      });
      const savedCourse = await courseRepository.save(course);
      const places = await Promise.all(
        Array.from({ length: 3 }, (_, i) =>
          placeRepository.save(
            PlaceFixture.createPlace({
              name: `Place ${i + 1}`,
              formattedAddress: `Address ${i + 1}`,
            }),
          ),
        ),
      );
      const setPlacesOfCourseRequest = {
        places: places.map((place, index) => ({
          placeId: place.id,
          comment: `Comment ${index + 1}`,
        })),
      };

      const result = await courseService.updatePins(
        savedCourse.id,
        setPlacesOfCourseRequest,
      );

      expect(result.places).toHaveLength(
        setPlacesOfCourseRequest.places.length,
      );

      setPlacesOfCourseRequest.places.forEach((expectedPlace, index) => {
        expect(result.places[index]).toMatchObject({
          id: expectedPlace.placeId,
          comment: expectedPlace.comment,
        });
      });
    });
  });
});
