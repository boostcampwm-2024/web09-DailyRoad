import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { DataSource, Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initDataSource } from '@test/config/datasource.config';
import { CourseService } from '@src/course/course.service';
import { CourseRepository } from '@src/course/course.repository';
import { CoursePlace } from '@src/course/entity/course-place.entity';
import { PlaceRepository } from '@src/place/place.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JWTHelper } from '@src/auth/JWTHelper';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '@src/user/user.repository';

describe('CourseE2E', () => {
  let app: INestApplication;
  let container: StartedMySqlContainer;
  let dataSource: DataSource;

  let userRepository: UserRepository;
  let courseRepository: CourseRepository;
  let coursePlaceRepository: Repository<CoursePlace>;
  let placeRepository: PlaceRepository;
  let courseService: CourseService;

  let jwtHelper: JWTHelper;
  let token: string;

  beforeAll(async () => {
    initializeTransactionalContext();
    container = await new MySqlContainer().withReuse().start();
    dataSource = await initDataSource(container);
    coursePlaceRepository = dataSource.getRepository(CoursePlace);

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .overrideProvider(UserRepository)
      .useValue(new UserRepository(dataSource))
      .overrideProvider(PlaceRepository)
      .useValue(new PlaceRepository(dataSource))
      .overrideProvider(CourseRepository)
      .useValue(new CourseRepository(dataSource, coursePlaceRepository))
      .overrideProvider(CoursePlace)
      .useValue(coursePlaceRepository)
      .overrideProvider(CourseService)
      .useValue(new CourseService(courseRepository, placeRepository))
      .overrideProvider(JWTHelper)
      .useValue({
        jwtSecretKey: 'test-key',
        generateToken: (expiresIn: string | number, payload: any = {}) => {
          return jwt.sign(payload, 'test-key', { expiresIn });
        },
        verifyToken: (refreshToken: string) => {
          return jwt.verify(refreshToken, 'test-key');
        },
      })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    jwtHelper = app.get<JWTHelper>(JWTHelper);

    userRepository = module.get<UserRepository>(UserRepository);
    placeRepository = module.get<PlaceRepository>(PlaceRepository);
    courseRepository = module.get<CourseRepository>(CourseRepository);
    courseService = module.get<CourseService>(CourseService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await courseRepository.delete({});
    token = null;
  });
});
