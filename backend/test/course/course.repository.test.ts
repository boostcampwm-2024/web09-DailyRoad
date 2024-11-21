import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { initDataSource } from '../config/datasource.config';
import { CourseRepository } from '../../src/course/course.repository';
import { CourseFixture } from './fixture/course.fixture';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../src/user/entity/user.entity';
import { UserFixture } from '../user/fixture/user.fixture';
import { CoursePlace } from '@src/course/entity/course-place.entity';

describe('CourseRepository', () => {
  let container: StartedMySqlContainer;
  let datasource: DataSource;

  let courseRepository: CourseRepository;
  let coursePlaceRepository: Repository<CoursePlace>;

  let fakeUser1: User;
  let fakeUser2: User;

  beforeAll(async () => {
    container = await new MySqlContainer().withReuse().start();
    datasource = await initDataSource(container);

    coursePlaceRepository = datasource.getRepository(CoursePlace);
    courseRepository = new CourseRepository(datasource, coursePlaceRepository);

    fakeUser1 = UserFixture.createUser({ oauthId: 'abc' });
    fakeUser2 = UserFixture.createUser({ oauthId: 'def' });
    await datasource.getRepository(User).save([fakeUser1, fakeUser2]);
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  beforeEach(async () => {
    await courseRepository.delete({});
  });

  it('공개되어 있는 코스를 반환한다', async () => {
    const publicCourses = [
      { title: 'Public Course 1', isPublic: true },
      { title: 'Public Course 2', isPublic: true },
    ];
    const privateCourses = [
      { title: 'Private Course 1', isPublic: false },
      { title: 'Private Course 2', isPublic: false },
    ];
    const courses = [...publicCourses, ...privateCourses].map(
      ({ title, isPublic }) =>
        CourseFixture.createCourse({ user: fakeUser1, title, isPublic }),
    );

    await courseRepository.save(courses);

    const page = 1;
    const pageSize = 10;
    const results = await courseRepository.findAll(page, pageSize);

    expect(results).toHaveLength(publicCourses.length);
    expect(results).toEqual(
      expect.arrayContaining(
        publicCourses.map((course) => expect.objectContaining(course)),
      ),
    );
  });

  describe('코스 이름에 포함된 키워드를 찾아 해당하는 코스를 반환한다', () => {
    it('키워드의 대소문자를 구분하지 않는다', async () => {
      const coursesWithTravel = [
        { title: 'TravelCourse 1', isPublic: true },
        { title: 'travelCourse 2', isPublic: true },
      ];
      const coursesWithoutTravel = [
        { title: 'DateCourse 1', isPublic: true },
        { title: 'FoodCourse 2', isPublic: true },
      ];
      const courses = [...coursesWithTravel, ...coursesWithoutTravel].map(
        ({ title, isPublic }) =>
          CourseFixture.createCourse({ user: fakeUser1, title, isPublic }),
      );
      await courseRepository.save(courses);

      const page = 1;
      const pageSize = 10;
      const query = 'travel';
      const results = await courseRepository.searchByTitleQuery(
        query,
        page,
        pageSize,
      );

      expect(results).toHaveLength(coursesWithTravel.length);
      expect(results).toEqual(
        expect.arrayContaining(
          coursesWithTravel.map((course) => expect.objectContaining(course)),
        ),
      );
    });

    it('검색은 공개 코스에 대해서만 이루어진다', async () => {
      const publicCourses = [
        { title: 'Public Travel Course 1', isPublic: true },
        { title: 'Public Travel Course 2', isPublic: true },
      ];
      const privateCourses = [
        { title: 'Private Travel Course 1', isPublic: false },
        { title: 'Private Travel Course 2', isPublic: false },
      ];

      const courses = [...publicCourses, ...privateCourses].map(
        ({ title, isPublic }) =>
          CourseFixture.createCourse({ user: fakeUser1, title, isPublic }),
      );
      await courseRepository.save(courses);

      const page = 1;
      const pageSize = 10;
      const query = 'Travel';
      const results = await courseRepository.searchByTitleQuery(
        query,
        page,
        pageSize,
      );
      expect(results).toHaveLength(publicCourses.length);
      expect(results).toEqual(
        expect.arrayContaining(
          publicCourses.map((course) => expect.objectContaining(course)),
        ),
      );
    });
  });

  it('사용자의 아이디로 코스를 찾아 반환한다', async () => {
    const coursesWithFakeUser1 = [
      { title: 'Course 1' },
      { title: 'Course 2' },
    ].map(({ title }) =>
      CourseFixture.createCourse({ user: fakeUser1, title }),
    );
    const coursesWithFakeUser2 = [
      { title: 'Course 3' },
      { title: 'Course 4' },
      { title: 'Course 5' },
    ].map(({ title }) =>
      CourseFixture.createCourse({ user: fakeUser2, title }),
    );
    await courseRepository.save([
      ...coursesWithFakeUser1,
      ...coursesWithFakeUser2,
    ]);

    const page = 1;
    const pageSize = 10;
    const results = await courseRepository.findByUserId(
      fakeUser1.id,
      page,
      pageSize,
    );

    expect(results).toHaveLength(coursesWithFakeUser1.length);
    expect(results).toEqual(
      expect.arrayContaining(
        coursesWithFakeUser1.map((course) => expect.objectContaining(course)),
      ),
    );
  });

  it('공개된 코스의 개수를 반환한다', async () => {
    const publicCourses = [
      { title: 'Public Course 1', isPublic: true },
      { title: 'Public Course 2', isPublic: true },
      { title: 'Public Course 3', isPublic: true },
    ];
    const privateCourses = [
      { title: 'Private Course 1', isPublic: false },
      { title: 'Private Course 2', isPublic: false },
    ];
    const courses = [...publicCourses, ...privateCourses].map(
      ({ title, isPublic }) =>
        CourseFixture.createCourse({ user: fakeUser1, title, isPublic }),
    );

    await courseRepository.save(courses);

    const count = await courseRepository.countAllPublic();
    expect(count).toBe(publicCourses.length);
  });

  it('사용자의 아이디로 코스의 개수를 반환한다', async () => {
    const coursesWithFakeUser1 = [
      { title: 'Course 1' },
      { title: 'Course 2' },
    ].map(({ title }) =>
      CourseFixture.createCourse({ user: fakeUser1, title }),
    );
    const coursesWithFakeUser2 = [
      { title: 'Course 3' },
      { title: 'Course 4' },
      { title: 'Course 5' },
    ].map(({ title }) =>
      CourseFixture.createCourse({ user: fakeUser2, title }),
    );
    await courseRepository.save([
      ...coursesWithFakeUser1,
      ...coursesWithFakeUser2,
    ]);

    const count = await courseRepository.countByUserId(fakeUser1.id);
    expect(count).toBe(coursesWithFakeUser1.length);
  });

  it('코스의 공개 여부를 업데이트한다', async () => {
    const course = CourseFixture.createCourse({
      user: fakeUser1,
      isPublic: true,
    });
    await courseRepository.save(course);

    const isPublic = false;
    await courseRepository.updateIsPublicById(course.id, isPublic);

    const result = (
      await datasource.query('SELECT * FROM COURSE WHERE id = ?', [course.id])
    )[0];

    expect(Boolean(result.is_public)).toEqual(isPublic);
  });

  it('코스의 정보를 업데이트한다', async () => {
    const course = CourseFixture.createCourse({
      user: fakeUser1,
      title: 'Old Title',
      description: 'Old Description',
      thumbnailUrl: 'Old Thumbnail Url',
    });
    await courseRepository.save(course);

    const title = 'New Title';
    const description = 'New Description';
    const thumbnailUrl = 'New Thumbnail Url';
    await courseRepository.updateInfoById(
      course.id,
      title,
      description,
      thumbnailUrl,
    );

    const result = (
      await datasource.query('SELECT * FROM COURSE WHERE id = ?', [course.id])
    )[0];

    expect(result.title).toEqual(title);
    expect(result.description).toEqual(description);
    expect(result.thumbnail_url).toEqual(thumbnailUrl);
  });
});
