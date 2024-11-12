import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { initDataSource } from '../config/datasource.config';
import { CourseRepository } from '../../src/course/course.repository';
import { CourseFixture } from './fixture/course.fixture';
import { DataSource } from 'typeorm';
import { User } from '../../src/user/entity/user.entity';
import { UserFixture } from '../user/fixture/user.fixture';

describe('CourseRepository', () => {
  let container: StartedMySqlContainer;
  let courseRepository: CourseRepository;
  let datasource: DataSource;
  let fakeUser: User;

  beforeAll(async () => {
    container = await new MySqlContainer().withReuse().start();
    datasource = await initDataSource(container);
    courseRepository = new CourseRepository(datasource);

    fakeUser = UserFixture.createUser({});
    await datasource.getRepository(User).save(fakeUser);
  });

  beforeEach(async () => {
    await courseRepository.delete({});
  });

  it('공개되어 있는 코스를 반환한다.', async () => {
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
        CourseFixture.createCourse({ user: fakeUser, title, isPublic }),
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
});
