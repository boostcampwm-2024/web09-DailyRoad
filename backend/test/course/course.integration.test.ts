import { CourseRepository } from '@src/course/course.repository';
import { UserRepository } from '@src/user/user.repository';
import * as request from 'supertest';
import { CourseFixture } from '@test/course/fixture/course.fixture';
import { User } from '@src/user/entity/user.entity';
import { UserFixture } from '@test/user/fixture/user.fixture';
import {
  convertDateToSeoulTime,
  initializeIntegrationTestEnvironment,
} from '@test/config/utils';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

describe('CourseE2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: UserRepository;
  let courseRepository: CourseRepository;

  let fakeUser1: User;
  let fakeUser1Id: number;

  beforeAll(async () => {
    ({ app, dataSource } = await initializeIntegrationTestEnvironment());
    userRepository = app.get<UserRepository>(UserRepository);
    courseRepository = app.get<CourseRepository>(CourseRepository);

    fakeUser1 = UserFixture.createUser({});
    const savedFakeUser1 = await userRepository.save(fakeUser1);
    fakeUser1Id = savedFakeUser1.id;
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await courseRepository.delete({});
  });

  describe(`GET /courses : 성공`, () => {
    it(`공개된 모든 코스를 조회한다.`, async () => {
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

      return request(app.getHttpServer())
        .get('/courses')
        .expect(200)
        .then((response) => {
          const courses = response.body.courses;
          expect(courses).toEqual(
            publicCourses.map((publicCourse, index) => ({
              id: index + 1,
              title: publicCourse.title,
              isPublic: publicCourse.isPublic,
              user: {
                id: fakeUser1Id,
                nickname: fakeUser1.nickname,
                profileImageUrl: fakeUser1.profileImageUrl,
              },
              thumbnailUrl: publicCourse.thumbnailUrl,
              description: publicCourse.description,
              pinCount: publicCourse.pinCount,
              createdAt: convertDateToSeoulTime(publicCourse.createdAt),
              updatedAt: convertDateToSeoulTime(publicCourse.updatedAt),
            })),
          );
        });
    });
  });
});
