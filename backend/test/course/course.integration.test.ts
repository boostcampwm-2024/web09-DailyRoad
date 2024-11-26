import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { DataSource, Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initDataSource } from '@test/config/datasource.config';
import { CourseService } from '@src/course/course.service';
import { CourseRepository } from '@src/course/course.repository';
import { CoursePlace } from '@src/course/entity/course-place.entity';
import { PlaceRepository } from '@src/place/place.repository';
import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { CourseController } from '@src/course/course.controller';

describe('CourseE2E', () => {
  let container: StartedMySqlContainer;
  let datasource: DataSource;
  let courseController: CourseController;
  let courseService: CourseService;
  let courseRepository: CourseRepository;
  let coursePlaceRepository: Repository<CoursePlace>;
  let placeRepository: PlaceRepository;

  beforeAll(async () => {
    initializeTransactionalContext();
    container = await new MySqlContainer().withReuse().start();
    datasource = await initDataSource(container);
    coursePlaceRepository = datasource.getRepository(CoursePlace);
    placeRepository = new PlaceRepository(datasource);
    courseRepository = new CourseRepository(datasource, coursePlaceRepository);

    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CourseService)
      .useValue(courseService)
      .overrideProvider(CourseRepository)
      .useValue(courseRepository)
      .overrideProvider(PlaceRepository)
      .useValue(placeRepository)
      .compile();
    courseService = module.get<CourseService>(CourseService);
    courseController = module.get<CourseController>(CourseController);
  });

  afterAll(async () => {
    await datasource.destroy();
  });

  beforeEach(async () => {
    await courseRepository.delete({});
  });
});
