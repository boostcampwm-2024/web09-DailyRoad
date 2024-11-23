import { MySqlContainer } from '@testcontainers/mysql';
import { initDataSource } from '@test/config/datasource.config';
import { MapRepository } from '@src/map/map.repository';
import { PlaceRepository } from '@src/place/place.repository';
import { UserRepository } from '@src/user/user.repository';
import { UserFixture } from '@test/user/fixture/user.fixture';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MapController } from '@src/map/map.controller';
import { DataSource } from 'typeorm';
import { MapService } from '@src/map/map.service';
import { JWTHelper } from '@src/auth/JWTHelper';
import { ValidationPipe } from '@nestjs/common';

export async function initializeDatabase() {
  const container = await new MySqlContainer().withReuse().start();
  const dataSource = await initDataSource(container);

  const mapRepository = new MapRepository(dataSource);
  const placeRepository = new PlaceRepository(dataSource);
  const userRepository = new UserRepository(dataSource);
  const fakeUser1 = UserFixture.createUser({ oauthId: 'abc' });
  const fakeUser2 = UserFixture.createUser({ oauthId: 'def' });
  return {
    container,
    dataSource,
    mapRepository,
    placeRepository,
    userRepository,
    fakeUser1,
    fakeUser2,
  };
}

export async function initializeTestModule(dataSource: DataSource) {
  const module: TestingModule = await Test.createTestingModule({
    imports: [ConfigModule.forRoot()],
    controllers: [MapController],
    providers: [
      {
        provide: DataSource,
        useValue: dataSource,
      },
      {
        provide: PlaceRepository,
        useFactory: (dataSource: DataSource) => new PlaceRepository(dataSource),
        inject: [DataSource],
      },
      {
        provide: UserRepository,
        useFactory: (dataSource: DataSource) => new UserRepository(dataSource),
        inject: [DataSource],
      },
      {
        provide: MapRepository,
        useFactory: (dataSource: DataSource) => new MapRepository(dataSource),
        inject: [DataSource],
      },
      {
        provide: MapService,
        useFactory: (
          mapRepository: MapRepository,
          userRepository: UserRepository,
          placeRepository: PlaceRepository,
        ) => new MapService(mapRepository, userRepository, placeRepository),
        inject: [MapRepository, UserRepository, PlaceRepository],
      },
      JWTHelper,
    ],
  }).compile();
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const jwtHelper = app.get<JWTHelper>(JWTHelper);
  const mapService = app.get<MapService>(MapService);
  const userRepository = app.get<UserRepository>(UserRepository);
  const mapRepository = app.get<MapRepository>(MapRepository);
  await mapRepository.delete({});
  await app.init();
  return { app, jwtHelper, mapService, userRepository, mapRepository };
}

export async function createPayload(userRepository: UserRepository) {
  const fakeUser = await userRepository.findById(1);
  return {
    userId: fakeUser.id,
    role: fakeUser.role,
  };
}

export function createInvalidToken(validToken: string): string {
  const parts = validToken.split('.');
  parts[1] = Buffer.from('{"userId":1,"role":"admin"}').toString('base64'); // 조작된 페이로드
  return parts.join('.');
}
