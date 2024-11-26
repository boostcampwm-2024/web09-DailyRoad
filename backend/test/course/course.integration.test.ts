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
      const savedCourses = await courseRepository.find();

      return request(app.getHttpServer())
        .get('/courses')
        .expect(200)
        .then(async (response) => {
          const expectedCourses = savedCourses.map((course) => ({
            id: course.id,
            title: course.title,
            isPublic: course.isPublic,
            user: {
              id: fakeUser1Id,
              nickname: fakeUser1.nickname,
              profileImageUrl: fakeUser1.profileImageUrl,
            },
            thumbnailUrl: course.thumbnailUrl,
            description: course.description,
            pinCount: course.pinCount,
            createdAt: convertDateToSeoulTime(course.createdAt),
            updatedAt: convertDateToSeoulTime(course.updatedAt),
          }));

          expect(response.body.courses).toEqual(expectedCourses);
        });
    });
  });
});
