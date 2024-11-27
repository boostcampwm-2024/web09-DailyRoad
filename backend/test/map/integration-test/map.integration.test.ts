import { MapController } from '@src/map/map.controller';
import { MapService } from '@src/map/map.service';
import { UserFixture } from '@test/user/fixture/user.fixture';
import { User } from '@src/user/entity/user.entity';
import { UserRepository } from '@src/user/user.repository';
import { PlaceRepository } from '@src/place/place.repository';
import { MapRepository } from '@src/map/map.repository';
import { DataSource } from 'typeorm';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { initDataSource } from '@test/config/datasource.config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JWTHelper } from '@src/auth/JWTHelper';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import {
  createPlace,
  createPrivateMaps,
  createPublicMaps,
  createPublicMapsWithTitle,
} from '@test/map/map.test.util';
import { Map } from '@src/map/entity/map.entity';
import { Color } from '@src/place/place.color.enum';
import {
  EMPTY_TOKEN_EXCEPTION,
  EXPIRE_TOKEN_EXCEPTION,
  INVALID_TOKEN_EXCEPTION,
  MAP_NOT_FOUND_EXCEPTION,
  MAP_PERMISSION_EXCEPTION,
} from '@test/map/integration-test/map.integration.expectExcptions';
import {
  createInvalidToken,
  initMapUserPlaceTable,
} from '@test/map/integration-test/map.integration.util';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { MapPlace } from '@src/map/entity/map-place.entity';

describe('MapController 통합 테스트', () => {
  let app: INestApplication;
  let container: StartedMySqlContainer;
  let dataSource: DataSource;

  let userRepository: UserRepository;
  let mapRepository: MapRepository;
  let placeRepository: PlaceRepository;

  let mapService: MapService;

  let fakeUser1: User;
  let fakeUser2: User;

  let fakeUser1Id: number;
  let fakeUser2Id: number;

  let jwtHelper: JWTHelper;
  let token: string;

  beforeAll(async () => {
    token = null;
    fakeUser1 = UserFixture.createUser({ oauthId: 'abc' });
    fakeUser2 = UserFixture.createUser({ oauthId: 'def' });

    container = await new MySqlContainer().withReuse().start();
    dataSource = await initDataSource(container);
    initializeTransactionalContext();

    mapRepository = new MapRepository(dataSource);
    placeRepository = new PlaceRepository(dataSource);
    userRepository = new UserRepository(dataSource);

    await initMapUserPlaceTable(mapRepository, userRepository, placeRepository);

    const [fakeUser1Entity, fakeUser2Entity] = await userRepository.save([
      fakeUser1,
      fakeUser2,
    ]);

    fakeUser1Id = fakeUser1Entity.id;
    fakeUser2Id = fakeUser2Entity.id;

    const places = createPlace(10);
    await placeRepository.save(places);
  });

  beforeEach(async () => {
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
          useValue: placeRepository,
        },
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: MapRepository,
          useValue: mapRepository,
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
    })
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

    jwtHelper = app.get<JWTHelper>(JWTHelper);
    mapService = app.get<MapService>(MapService);

    await mapRepository.delete({});
    token = null;
    await app.init();
  });

  afterEach(async () => {
    await mapRepository.delete({});
    await mapRepository.query(`ALTER TABLE MAP AUTO_INCREMENT = 1`);
  });

  afterAll(async () => {
    await initMapUserPlaceTable(mapRepository, userRepository, placeRepository);

    await dataSource.destroy();
    await app.close();
  });

  describe('getMyMapList 메소드 테스트', () => {
    it('GET /my 에 대한 요청에 해당 유저 ID 가 가지는 모든 지도의 정보를 반환한다.', async () => {
      const fakeUser1 = await userRepository.findById(fakeUser1Id);
      const fakeUser2 = await userRepository.findById(fakeUser2Id);
      const fakeUserOneMaps = createPublicMaps(3, fakeUser1);
      const fakeUserTwoMaps = createPublicMaps(3, fakeUser2);
      await mapRepository.save([...fakeUserOneMaps, ...fakeUserTwoMaps]);
      const userInfo = {
        userId: fakeUser1.id,
        role: fakeUser1.role,
      };
      token = jwtHelper.generateToken('24h', userInfo);

      return request(app.getHttpServer())
        .get('/maps/my')
        .set('Authorization', `Bearer ${token}`)

        .expect(200)
        .then((response) => {
          const gotMaps = response.body.maps;
          expect(gotMaps.length).toEqual(fakeUserOneMaps.length);
          gotMaps.forEach((gotMaps, index) => {
            const expectedMap = fakeUserOneMaps[index];
            expect(gotMaps.id).toEqual(expectedMap.id);
            expect(gotMaps.title).toEqual(expectedMap.title);
            expect(gotMaps.isPublic).toEqual(expectedMap.isPublic);
            expect(gotMaps.thumbnailUrl).toEqual(expectedMap.thumbnailUrl);
            expect(gotMaps.description).toEqual(expectedMap.description);
            expect(gotMaps.pinCount).toEqual(0);
            expect(new Date(gotMaps.createdAt).toISOString()).toEqual(
              new Date(expectedMap.createdAt).toISOString(),
            );
            expect(new Date(gotMaps.updatedAt).toISOString()).toEqual(
              new Date(expectedMap.updatedAt).toISOString(),
            );
          });
        });
    });

    it('GET /my 에 대한 요청에 토큰이 없을 경우 AuthenticationException 에러를 발생시킨다.', async () => {
      return request(app.getHttpServer()).get('/maps/my').expect(401);
    });

    it('GET /my 에 대한 요청에 토큰이 만료됐을 경우 AuthenticationException 에러를 발생시킨다.', async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
      token = jwtHelper.generateToken('1s', payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return request(app.getHttpServer())
        .get('/maps/my')
        .set('Authorization', `Bearer ${token}`)

        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(EXPIRE_TOKEN_EXCEPTION),
          );
        });
    });

    it('GET /my 에 대한 요청에 토큰이 조작됐을 경우 AuthenticationException 에러를 발생시킨다.', async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
      token = jwtHelper.generateToken('24h', payload);
      const invalidToken = createInvalidToken(token);

      return request(app.getHttpServer())
        .get('/maps/my')
        .set(`Authorization`, `Bearer ${invalidToken}`)

        .expect(401);
    });
  });

  describe('getMapList 메소드 테스트', () => {
    it('GET maps/ 에 대한 요청으로 공개 되어있고, 장소를 가지고 있는 지도 모두 반환한다.', async () => {
      const publicMaps = createPublicMaps(2, fakeUser1);
      const publicMapsWithPlace = createPublicMaps(3, fakeUser1);
      const privateMaps = createPrivateMaps(5, fakeUser1);
      publicMapsWithPlace.forEach((publicMapWithPlace) => {
        publicMapWithPlace.mapPlaces = [];
        publicMapWithPlace.mapPlaces.push(
          MapPlace.of(1, publicMapWithPlace, Color.RED, 'test'),
        );
      });
      await mapRepository.save([
        ...publicMaps,
        ...publicMapsWithPlace,
        ...privateMaps,
      ]);

      return request(app.getHttpServer())
        .get('/maps')

        .expect((response) => {
          const gotMaps = response.body.maps;
          expect(gotMaps.length).toEqual(publicMapsWithPlace.length);
          gotMaps.forEach((gotMap: Map, index: number) => {
            expect(gotMap.title).toEqual(publicMapsWithPlace[index].title);
            expect(gotMap.description).toEqual(
              publicMapsWithPlace[index].description,
            );
            expect(gotMap.isPublic).toEqual(
              publicMapsWithPlace[index].isPublic,
            );
            expect(gotMap.thumbnailUrl).toEqual(
              publicMapsWithPlace[index].thumbnailUrl,
            );
          });
        });
    });

    it('GET /maps?query 에 대한 요청으로 공개 되어있고 query 와 유사한 title을 가지는 지도들을 반환한다.', async () => {
      const publicMapsWithCoolTitle = createPublicMapsWithTitle(
        2,
        fakeUser1,
        'cool test title',
      );
      const publicMapsWithCoolTitleAndPlace = createPublicMapsWithTitle(
        3,
        fakeUser1,
        'cool title',
      );
      const privateMaps = createPrivateMaps(5, fakeUser1);
      publicMapsWithCoolTitleAndPlace.forEach((publicMapWithPlace) => {
        publicMapWithPlace.mapPlaces = [];
        publicMapWithPlace.mapPlaces.push(
          MapPlace.of(1, publicMapWithPlace, Color.RED, 'test'),
        );
      });
      publicMapsWithCoolTitle.forEach((publicMap) => {
        publicMap.mapPlaces = [];
      });
      const publicMaps = [
        ...publicMapsWithCoolTitle,
        ...publicMapsWithCoolTitleAndPlace,
      ];
      await mapRepository.save([...publicMaps, ...privateMaps]);

      return request(app.getHttpServer())
        .get('/maps?query=cool')

        .expect((response) => {
          const gotMaps = response.body.maps;
          expect(gotMaps.length).toEqual(publicMaps.length);
          gotMaps.forEach((gotMap: Map, index: number) => {
            expect(gotMap.title).toEqual(publicMaps[index].title);
            expect(gotMap.description).toEqual(publicMaps[index].description);
            expect(gotMap.isPublic).toEqual(publicMaps[index].isPublic);
            expect(gotMap.thumbnailUrl).toEqual(publicMaps[index].thumbnailUrl);
          });
        });
    });
  });

  describe('getMapDetail 메소드 테스트', () => {
    it('GET /maps/:id 에 대해서 지도의 id 와 params 의 id 가 일치하는 지도의 정보를 반환한다.', async () => {
      const maps = createPublicMaps(5, fakeUser1);
      await mapRepository.save([...maps]);
      const EXPECT_MAP_ID = 3;

      return request(app.getHttpServer())
        .get(`/maps/${EXPECT_MAP_ID}`)

        .expect(200)
        .expect((response) => {
          const gotMap = response.body;
          expect(gotMap.title).toEqual(maps[EXPECT_MAP_ID - 1].title);
          expect(gotMap.title).toEqual(maps[EXPECT_MAP_ID - 1].title);
          expect(gotMap.description).toEqual(
            maps[EXPECT_MAP_ID - 1].description,
          );
          expect(gotMap.isPublic).toEqual(maps[EXPECT_MAP_ID - 1].isPublic);
          expect(gotMap.thumbnailUrl).toEqual(
            maps[EXPECT_MAP_ID - 1].thumbnailUrl,
          );
        });
    });

    it('GET /maps/:id 요청을 받았을 때 지도의 id 와 params 의 id 가 일치하는 지도가 없을 경우 MapNotFoundException 를 발생시킨다.', async () => {
      const maps = createPublicMaps(5, fakeUser1);
      await mapRepository.save([...maps]);
      const EXPECT_MAP_ID = 55;

      const result = await request(app.getHttpServer())
        .get(`/maps/${EXPECT_MAP_ID}`)

        .expect(404);
      expect(result.body).toEqual(
        expect.objectContaining(MAP_NOT_FOUND_EXCEPTION(EXPECT_MAP_ID)),
      );
    });
  });

  describe('createMap 메소드 테스트', () => {
    it('POST /maps/ 요청에 대해 토큰이 없을 경우 AuthenticationException 예외를 발생시킨다', async () => {
      const result = await request(app.getHttpServer())
        .post('/maps/')
        .send({
          title: 'Test Map',
          description: 'This is a test map.',
          isPublic: true,
          thumbnailUrl: 'http://example.com/test-map-thumbnail.jpg',
        })

        .expect(401);
      expect(result.body).toEqual(
        expect.objectContaining(EMPTY_TOKEN_EXCEPTION),
      );
    });

    it('POST /maps/ 요청에 대해서 조작된 토큰과 함께 요청이 발생할 경우 AuthenticationException 예외를 발생시킨다', async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
      token = jwtHelper.generateToken('24h', payload);
      const invalidToken = createInvalidToken(token);

      return request(app.getHttpServer())
        .post('/maps/')
        .set(`Authorization`, `Bearer ${invalidToken}`)
        .send({
          title: 'Test Map',
          description: 'This is a test map.',
          isPublic: true,
          thumbnailUrl: 'http://example.com/test-map-thumbnail.jpg',
        })

        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(INVALID_TOKEN_EXCEPTION),
          );
        });
    });

    it('POST /maps/ 요청에 대해서 만료된 토큰과 함께 요청이 발생할 경우 AuthenticationException 예외를 발생시킨다', async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
      token = jwtHelper.generateToken('1s', payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return request(app.getHttpServer())
        .post('/maps/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Map',
          description: 'This is a test map.',
          isPublic: true,
          thumbnailUrl: 'http://example.com/test-map-thumbnail.jpg',
        })

        .expect(401)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(EXPIRE_TOKEN_EXCEPTION),
          );
        });
    });

    it('/POST /maps 요청의 Body 에 title 이 없을 경우 Bad Request 예외를 발생시킨다.', async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .post('/maps/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'This is a test map.',
          isPublic: true,
          thumbnailUrl: 'http://example.com/test-map-thumbnail.jpg',
        })

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: ['title should not be empty', 'title must be a string'],
            }),
          );
        });
    });

    it('/POST /maps 요청의 Body 에 description 이 없을 경우 Bad Request 예외를 발생시킨다.', async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .post('/maps/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Map',
          isPublic: true,
          thumbnailUrl: 'http://example.com/test-map-thumbnail.jpg',
        })

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: ['description must be a string'],
            }),
          );
        });
    });

    it('/POST /maps 에 올바른 Body 와 유효한 토큰을 설정한 요청에 대해서 적절하게 저장하고, 저장한 지도에 대한 id 를 반환한다.', async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
      token = jwtHelper.generateToken('24h', payload);
      const testMap = {
        title: 'Test Map',
        description: 'This is a test map.',
        isPublic: true,
        thumbnailUrl: 'http://example.com/test-map-thumbnail.jpg',
      };

      return request(app.getHttpServer())
        .post('/maps/')
        .set('Authorization', `Bearer ${token}`)
        .send(testMap)

        .expect(201)
        .expect(async (response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: 1,
            }),
          );
          const mapInfo = await mapRepository.findById(response.body.id);
          expect(mapInfo).toEqual(expect.objectContaining(testMap));
        });
    });
  });

  describe('addPlaceToMap 메소드 테스트', () => {
    let publicMap: Map;
    let testPlace: { placeId: number; comment: string; color: string };
    let payload: { userId: number; role: string };

    beforeEach(async () => {
      publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);
      testPlace = {
        placeId: 5,
        comment: 'Beautiful park with a lake',
        color: 'BLUE',
      };

      await mapService.addPlace(
        1,
        1,
        testPlace.color as Color,
        testPlace.comment,
      );

      const fakeUserInfo = await userRepository.findById(fakeUser1Id);
      payload = {
        userId: fakeUserInfo.id,
        role: fakeUserInfo.role,
      };
    });

    afterEach(async () => {
      await mapRepository.query(`ALTER TABLE MAP AUTO_INCREMENT=1;`);
      await mapRepository.delete({});
    });

    it('POST /maps/:id/places 요청의 Body의 placeId의 타입이 number가 아니라면 Bad Request 에러를 발생시킨다.', async () => {
      token = jwtHelper.generateToken('24h', payload);
      const InvalidTestPlace = {
        placeId: 'invalid id',
        comment: 'update test description',
        color: 'BLUE',
      };

      return request(app.getHttpServer())
        .post('/maps/1/places')
        .set('Authorization', `Bearer ${token}`)
        .send(InvalidTestPlace)

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: [
                'placeId must be a number conforming to the specified constraints',
              ],
            }),
          );
        });
    });

    it('POST /maps/:id/places 요청의 Body의 comment의 타입이 string이 아니라면 Bad Request 에러를 발생시킨다.', async () => {
      const InvalidTestPlace = {
        placeId: 5,
        comment: 9999999999,
        color: 'BLUE',
      };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .post('/maps/1/places')
        .set('Authorization', `Bearer ${token}`)
        .send(InvalidTestPlace)

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: ['comment must be a string'],
            }),
          );
        });
    });

    it('POST /maps/:id/places 요청의 Body의 color가  enum(Color) 아니라면 Bad Request 에러를 발생시킨다.', async () => {
      const InvalidTestPlace = {
        placeId: 5,
        comment: 'update test description',
        color: 'IVORY',
      };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .post('/maps/1/places')
        .set('Authorization', `Bearer ${token}`)
        .send(InvalidTestPlace)

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: [
                'color must be one of the following values: RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE',
              ],
            }),
          );
        });
    });

    it('POST /maps/:id/places 요청이 적절한 토큰과 Body를 가지지만 해당 지도에 해당 장소가 이미 있다면 DuplicatePlaceToMapException 에러를 발생시킨다.', async () => {
      token = jwtHelper.generateToken('24h', payload);
      await mapService.addPlace(
        1,
        testPlace.placeId,
        testPlace.color as Color,
        testPlace.comment,
      );

      return request(app.getHttpServer())
        .post('/maps/1/places')
        .set('Authorization', `Bearer ${token}`)
        .send(testPlace)

        .expect(409)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 409,
              message:
                '이미 지도에 존재하는 장소입니다. : ' + testPlace.placeId,
            }),
          );
        });
    });

    it('POST /maps/:id/places 요청이 적절한 토큰과 Body를 가지지만 해당 유저의 지도가 아니라면 MapPermissionException 을 발생한다.', async () => {
      const fakeUser2 = await userRepository.findById(fakeUser2Id);
      payload = {
        userId: fakeUser2.id,
        role: fakeUser2.role,
      };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .post('/maps/1/places')
        .set('Authorization', `Bearer ${token}`)
        .send(testPlace)

        .expect(403)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_PERMISSION_EXCEPTION(1)),
          );
        });
    });

    it('POST /maps/:id/places 요청이 적절한 토큰과 Body를 가진다면 해당 지도에 해당 장소를 저장하고 저장된 지도의 정보를 반환한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .post('/maps/1/places')
        .set('Authorization', `Bearer ${token}`)
        .send(testPlace)

        .expect(201)
        .expect((response) => {
          expect(response.body).toEqual(expect.objectContaining(testPlace));
        });
    });
  });

  describe('deletePlaceFromMap 메소드 테스트', () => {
    let payload: { userId: number; role: string };
    let testPlace: { placeId: number; comment: string; color: string };

    beforeEach(async () => {
      const fakeUserOneInfo = await userRepository.findById(fakeUser1Id);
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);

      testPlace = {
        placeId: 1,
        comment: 'Beautiful park with a lake',
        color: 'BLUE',
      };
      await mapService.addPlace(
        1,
        testPlace.placeId,
        testPlace.color as Color,
        testPlace.comment,
      );

      payload = {
        userId: fakeUserOneInfo.id,
        role: fakeUserOneInfo.role,
      };
    });

    it('DELETE /maps/:id/places/:placeId 요청의 지도의 id 를 찾지 못했을 경우 MapNotFoundException 예외를 발생한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .delete('/maps/3/places/1')
        .set('Authorization', `Bearer ${token}`)

        .expect(404)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_NOT_FOUND_EXCEPTION(3)),
          );
        });
    });

    it('DELETE /maps/:id/places/:placeId 요청에 올바른 토큰과 지도 id 를 설정했지만, 해당 유저의 지도가 아닐경우 MapPermissionException 을 발생한다.', async () => {
      const fakeUser2 = await userRepository.findById(fakeUser2Id);
      payload = {
        userId: fakeUser2.id,
        role: fakeUser2.role,
      };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .delete('/maps/1/places/1')
        .set('Authorization', `Bearer ${token}`)

        .expect(403)
        .expect(async (response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_PERMISSION_EXCEPTION(1)),
          );
        });
    });

    it('DELETE /maps/:id/places/:placeId 요청에 올바른 토큰과 지도 id 를 설정할 경우 해당 지도에서 placeId 를 삭제하고 해당 placeId 를 반환한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .delete(`/maps/1/places/1`)
        .set('Authorization', `Bearer ${token}`)

        .expect(200)
        .expect(async (response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              deletedId: 1,
            }),
          );
          const map = await mapRepository.findById(1);
          expect(map.mapPlaces.length).toBe(0);
        });
    });
  });

  describe('updateMapInfo 메소드 테스트', () => {
    let publicMap: Map;
    let testPlace: { placeId: number; comment: string; color: string };
    let payload: { userId: number; role: string };

    beforeEach(async () => {
      publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);

      testPlace = {
        placeId: 5,
        comment: 'Beautiful park with a lake',
        color: 'BLUE',
      };
      await mapService.addPlace(
        1,
        1,
        testPlace.color as Color,
        testPlace.comment,
      );

      const fakeUserInfo = await userRepository.findById(fakeUser1Id);
      payload = {
        userId: fakeUserInfo.id,
        role: fakeUserInfo.role,
      };
    });

    afterEach(async () => {
      await mapRepository.delete({});
    });

    it('/PATCH /:id/info 요청 Body 에 title 의 타입이 string이 아니라면 예외를 발생한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);
      const updateMapInfo = {
        title: 124124,
        description: 'this is updated test map',
      };

      return request(app.getHttpServer())
        .patch('/maps/1/info')
        .send(updateMapInfo)
        .set('Authorization', `Bearer ${token}`)

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: ['title must be a string'],
              error: 'Bad Request',
            }),
          );
        });
    });

    it('/PATCH /:id/info 요청 Body 에 description 의 타입이 string이 아니라면 예외를 발생한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);
      const updateMapInfo = {
        title: 'updated map title',
        description: 111111,
      };

      return request(app.getHttpServer())
        .patch('/maps/1/info')
        .send(updateMapInfo)
        .set('Authorization', `Bearer ${token}`)

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: ['description must be a string'],
              error: 'Bad Request',
            }),
          );
        });
    });

    it('/PATCH /:id/info 요청에 url params 의 지도 id 가 유효하지 않다면 MapNotFoundException 발생한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);
      const updateMapInfo = {
        title: 'updated map title',
        description: 'updated map description',
      };

      return request(app.getHttpServer())
        .patch('/maps/2/info')
        .send(updateMapInfo)
        .set('Authorization', `Bearer ${token}`)

        .expect(404)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_NOT_FOUND_EXCEPTION(2)),
          );
        });
    });

    it('/PATCH /:id/info 요청에 올바른 토큰과 적절한 요청 body, params 를 가지지만 해당 유저의 지도가 아닐경우 MapPermissionException 을 발생한다.', async () => {
      const fakeUser2 = await userRepository.findById(fakeUser2Id);
      payload = {
        userId: fakeUser2.id,
        role: fakeUser2.role,
      };
      token = jwtHelper.generateToken('24h', payload);
      const updateMapInfo = {
        title: 'updated map title',
        description: 'updated map description',
      };

      return request(app.getHttpServer())
        .patch('/maps/1/info')
        .send(updateMapInfo)
        .set('Authorization', `Bearer ${token}`)

        .expect(403)
        .expect(async (response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_PERMISSION_EXCEPTION(1)),
          );
        });
    });

    it('/PATCH /:id/info 요청에 올바른 토큰과 적절한 요청 body, params 를 가진다면 해당 지도의 정보를 업데이트하고 업데이트된 지도의 id 와 정보를 반환한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);
      const updateMapInfo = {
        title: 'updated map title',
        description: 'updated map description',
      };

      return request(app.getHttpServer())
        .patch('/maps/1/info')
        .send(updateMapInfo)
        .set('Authorization', `Bearer ${token}`)

        .expect(200)
        .expect(async (response) => {
          expect(response.body).toEqual({
            id: 1,
            ...updateMapInfo,
          });
          const updatedMap = await mapRepository.findById(1);
          expect(updatedMap).toEqual(
            expect.objectContaining({
              id: 1,
              ...updateMapInfo,
            }),
          );
        });
    });
  });

  describe('updateMapVisibility 메소드 테스트', () => {
    let publicMap: Map;
    let testPlace: { placeId: number; comment: string; color: string };
    let payload: { userId: number; role: string };

    beforeEach(async () => {
      publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);

      testPlace = {
        placeId: 5,
        comment: 'Beautiful park with a lake',
        color: 'BLUE',
      };
      await mapService.addPlace(
        1,
        1,
        testPlace.color as Color,
        testPlace.comment,
      );

      const fakeUserInfo = await userRepository.findById(fakeUser1Id);
      payload = {
        userId: fakeUserInfo.id,
        role: fakeUserInfo.role,
      };
    });

    afterEach(async () => {
      await mapRepository.delete({});
    });

    it('PATCH /maps/:id/visibility 요청의 body 의 isPublic 이 boolean 이 아닐경우 예외를 발생한다.', async () => {
      const updateIsPublic = { isPublic: 'NOT BOOLEAN' };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .patch('/maps/1/visibility')
        .send(updateIsPublic)
        .set('Authorization', `Bearer ${token}`)

        .expect(400)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              statusCode: 400,
              message: ['isPublic must be a boolean value'],
            }),
          );
        });
    });

    it('PATCH /maps/:id/visibility 요청에 적절한 토큰과 body가 있을 경우 지도의 id 와 변경된 isPublic 을 반환한다.', async () => {
      const updateIsPublic = { isPublic: false };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .patch('/maps/1/visibility')
        .send(updateIsPublic)
        .set('Authorization', `Bearer ${token}`)

        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: 1,
              isPublic: false,
            }),
          );
        });
    });

    it('PATCH /maps/:id/visibility 요청에 적절한 토큰과 body를 가지지만 해당 유저의 지도가 아닐 경우 MapPermissionException 을 발생한다.', async () => {
      const fakeUser2 = await userRepository.findById(fakeUser2Id);
      payload = {
        userId: fakeUser2.id,
        role: fakeUser2.role,
      };
      const updateIsPublic = { isPublic: false };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .patch('/maps/1/visibility')
        .send(updateIsPublic)
        .set('Authorization', `Bearer ${token}`)

        .expect(403)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_PERMISSION_EXCEPTION(1)),
          );
        });
    });

    it('PATCH /maps/:id/visibility 요청에 적절한 토큰과 body가 있지만 지도가 없을 경우 MapNotFoundException 을 발생한다.', async () => {
      const updateIsPublic = { isPublic: false };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .patch('/maps/5/visibility')
        .send(updateIsPublic)
        .set('Authorization', `Bearer ${token}`)

        .expect(404)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_NOT_FOUND_EXCEPTION(5)),
          );
        });
    });
  });

  describe('deleteMap 메소드 테스트', () => {
    let publicMap: Map;
    let payload: { userId: number; role: string };

    beforeEach(async () => {
      publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);

      const fakeUserInfo = await userRepository.findById(fakeUser1Id);
      payload = {
        userId: fakeUserInfo.id,
        role: fakeUserInfo.role,
      };
    });

    afterEach(async () => {
      await mapRepository.delete({});
    });

    it('DELETE /maps/:id 요청에 적절한 토큰이 있지만 해당하는 지도가 없다면 예외를 발생한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .delete('/maps/5/')
        .set('Authorization', `Bearer ${token}`)

        .expect(404)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_NOT_FOUND_EXCEPTION(5)),
          );
        });
    });

    it('DELETE /maps/:id 요청에 대해 적절한 토큰이 있지만, 해당 유저의 지도가 아닐 경우 MapPermissionException 을 발생한다.', async () => {
      const fakeUser2 = await userRepository.findById(fakeUser2Id);
      payload = {
        userId: fakeUser2.id,
        role: fakeUser2.role,
      };
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .delete('/maps/1')
        .set('Authorization', `Bearer ${token}`)

        .expect(403)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining(MAP_PERMISSION_EXCEPTION(1)),
          );
        });
    });

    it('DELETE /maps/:id 요청에 대해 적절한 토큰이 있고 id 에 해당하는 지도가 있으면 삭제하고 id를 반환한다.', async () => {
      token = jwtHelper.generateToken('24h', payload);

      return request(app.getHttpServer())
        .delete('/maps/1')
        .set('Authorization', `Bearer ${token}`)

        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual(expect.objectContaining({ id: 1 }));
        });
    });
  });
});
