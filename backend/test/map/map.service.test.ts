import { MapService } from '@src/map/map.service';
import { MapRepository } from '@src/map/map.repository';
import { PlaceRepository } from '@src/place/place.repository';
import { User } from '@src/user/entity/user.entity';
import { UserFixture } from '@test/user/fixture/user.fixture';
import {
  createPlace,
  createPrivateMaps,
  createPublicMaps,
  createPublicMapsWithTitle,
} from '@test/map/map.test.util';
import { Map } from '@src/map/entity/map.entity';
import { MapListResponse } from '@src/map/dto/MapListResponse';
import { UserRepository } from '@src/user/user.repository';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { initDataSource } from '@test/config/datasource.config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from '@src/map/map.controller';
import { INestApplication } from '@nestjs/common';
import { MapNotFoundException } from '@src/map/exception/MapNotFoundException';
import { MapDetailResponse } from '@src/map/dto/MapDetailResponse';
import { CreateMapRequest } from '@src/map/dto/CreateMapRequest';
import { Color } from '@src/place/place.color.enum';
import { InvalidPlaceToMapException } from '@src/map/exception/InvalidPlaceToMapException';
import { DuplicatePlaceToMapException } from '@src/map/exception/DuplicatePlaceToMapException';
import { Place } from '@src/place/entity/place.entity';
import { ConfigModule } from '@nestjs/config';
import { JWTHelper } from '@src/auth/JWTHelper';
import { UpdateMapInfoRequest } from '@src/map/dto/UpdateMapInfoRequest';
import { truncateTables } from '@test/config/utils';
import { MapPlace } from '@src/map/entity/map-place.entity';

describe('MapService 테스트', () => {
  let app: INestApplication;
  let container: StartedMySqlContainer;
  let dataSource: DataSource;

  let mapService: MapService;

  let mapRepository: MapRepository;
  let userRepository: UserRepository;
  let placeRepository: PlaceRepository;

  let fakeUser1: User;
  let page: number;
  let pageSize: number;

  beforeAll(async () => {
    container = await new MySqlContainer().withReuse().start();
    dataSource = await initDataSource(container);
    initializeTransactionalContext();

    mapRepository = new MapRepository(dataSource);
    placeRepository = new PlaceRepository(dataSource);
    userRepository = new UserRepository(dataSource);
    mapService = new MapService(mapRepository, userRepository, placeRepository);

    const module: TestingModule = await Test.createTestingModule({
      imports: [await ConfigModule.forRoot()],
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
    }).compile();

    app = module.createNestApplication();
    mapService = app.get<MapService>(MapService);
    await app.init();
    [page, pageSize] = [1, 10];
  });

  beforeEach(async () => {
    await truncateTables(dataSource);
    fakeUser1 = UserFixture.createUser({ oauthId: 'abc' });
    await userRepository.save(fakeUser1);

    const places = createPlace(10);
    await placeRepository.save(places);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('searchMap 메소드 테스트', () => {
    it('파라미터 중 쿼리가 있을 경우 해당 제목을 가진 지도들을 반환한다', async () => {
      const searchTitle = 'cool';
      const publicMapsWithTitle: Map[] = createPublicMapsWithTitle(
        5,
        fakeUser1,
        'cool map',
      );
      const savedMaps = await mapRepository.save([...publicMapsWithTitle]);
      savedMaps.forEach((mapEntity) => {
        mapEntity.mapPlaces = [];
      });
      const expectedMaps = await Promise.all(
        savedMaps.map((savedMap) => MapListResponse.from(savedMap)),
      );

      const result = await mapService.searchMap(searchTitle, 1, 10);

      expect(result.maps).toEqual(
        expect.arrayContaining(
          expectedMaps.map((map) => expect.objectContaining(map)),
        ),
      );
    });
  });

  describe('getAllMaps 메소드 테스트', () => {
    it('장소를 가지고 있고 공개된 모든 지도를 반환한다.', async () => {
      const publicMaps: Map[] = createPublicMaps(3, fakeUser1);
      const publicMapsWithPlaces = createPublicMaps(2, fakeUser1);
      const privateMaps = createPrivateMaps(5, fakeUser1);
      publicMapsWithPlaces.forEach((publicMapWithPlaces) => {
        publicMapWithPlaces.mapPlaces = [
          MapPlace.of(1, publicMapWithPlaces, Color.RED, 'test'),
        ];
      });
      await mapRepository.save([
        ...publicMaps,
        ...publicMapsWithPlaces,
        ...privateMaps,
      ]);
      await mapRepository.save([...privateMaps]);
      const expected = await Promise.all(
        publicMapsWithPlaces.map(MapListResponse.from),
      );

      const result = await mapService.getAllMaps(1, 10);

      expect(result.maps).toEqual(
        expect.arrayContaining(
          expected.map((response) => expect.objectContaining(response)),
        ),
      );
      expect(result.currentPage).toEqual(page);
      expect(result.totalPages).toEqual(
        Math.ceil(publicMapsWithPlaces.length / pageSize),
      );
    });
  });
  describe('getOwnMaps 메소드 테스트', () => {
    it('유저 아이디를 파라미터로 받아서 해당 유저의 지도를 반환한다.', async () => {
      const fakeUserMaps = createPublicMaps(5, fakeUser1);
      const savedMaps = await mapRepository.save([...fakeUserMaps]);
      savedMaps.forEach((savedMap) => (savedMap.mapPlaces = []));
      const expectedMaps = await Promise.all(
        fakeUserMaps.map((fakeUserMap) => MapListResponse.from(fakeUserMap)),
      );

      const result = await mapService.getOwnMaps(fakeUser1.id);

      expect(result.maps).toEqual(
        expect.arrayContaining(
          expectedMaps.map((map) => expect.objectContaining(map)),
        ),
      );
    });
  });

  describe('getMapById 메소드 테스트', () => {
    it('파라미터로 받은 mapId 로 지도를 찾은 결과가 없을 때 MapNotFoundException 예외를 발생시킨다.', async () => {
      await expect(mapService.getMapById(1)).rejects.toThrow(
        MapNotFoundException,
      );
    });

    it('파라미터로 받은 mapId 로 지도를 찾은 결과가 있으면 결과를 반환한다.', async () => {
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      const publicMapEntity = await mapRepository.save(publicMap);
      publicMapEntity.mapPlaces = [];
      const expectedMap = await MapDetailResponse.from(publicMapEntity);

      const result = await mapService.getMapById(publicMapEntity.id);

      expect(result).toEqual(expectedMap);
    });
  });

  describe('createMap 메소드 테스트', () => {
    it('파라미터로 받은 유저 아이디로 지도를 생성하고, 지도 id 를 반환한다.', async () => {
      const publicMap = CreateMapRequest.from({
        title: 'test map',
        description: 'This map is test map',
        isPublic: true,
        thumbnailUrl: 'basic_thumbnail.jpg',
      });

      const result = await mapService.createMap(1, publicMap);

      const publicMapEntity = await mapRepository.findById(1);
      expect(result).toEqual(
        expect.objectContaining({ id: publicMapEntity.id }),
      );
    });
  });

  describe('deleteMap 메소드 테스트', () => {
    it('파라미터로 mapId를 가진 지도가 없다면 MapNotFoundException 에러를 발생시킨다.', async () => {
      await expect(mapService.deleteMap(1)).rejects.toThrow(
        MapNotFoundException,
      );
    });

    it('파라미터로 mapId를 가진 지도가 있다면 삭제 후 삭제된 지도의 id 를 반환한다.', async () => {
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      const publicMapEntity = await mapRepository.save(publicMap);

      const result = await mapService.deleteMap(1);

      expect(result.id).toEqual(publicMapEntity.id);
    });
  });

  describe('updateMapInfo 메소드 테스트', () => {
    it('업데이트 하려는 지도가 없을경우 MapNotFoundException 에러를 발생시킨다.', async () => {
      const updateInfo = new UpdateMapInfoRequest();
      updateInfo.title = 'update test title';
      updateInfo.description = 'update test description';

      await expect(mapService.updateMapInfo(1, updateInfo)).rejects.toThrow(
        MapNotFoundException,
      );
    });

    it('업데이트 하려는 지도가 있을 경우 지도를 파라미터의 정보로 업데이트 한다.', async () => {
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);
      const updateInfo = new UpdateMapInfoRequest();
      updateInfo.title = 'update test title';
      updateInfo.description = 'update test description';

      await mapService.updateMapInfo(1, updateInfo);

      const publicMapEntity = await mapRepository.findById(1);
      expect(publicMapEntity.title).toEqual(updateInfo.title);
      expect(publicMapEntity.description).toEqual(updateInfo.description);
    });
  });

  describe('updateMapVisibility 메소드 테스트', () => {
    it('visibility 를 업데이트 하려는 지도가 없을 경우 MapNotFoundException 을 발생시킨다.', async () => {
      await expect(mapService.updateMapVisibility(1, true)).rejects.toThrow(
        MapNotFoundException,
      );
    });

    it('visibility를 업데이트 하려는 지도가 있을 경우 업데이트를 진행한다.', async () => {
      const privateMap = createPrivateMaps(1, fakeUser1)[0];
      await mapRepository.save(privateMap);

      await mapService.updateMapVisibility(1, true);

      const privateMapEntity = await mapRepository.findById(1);
      expect(privateMapEntity.isPublic).toEqual(true);
    });
  });

  describe('addPlace 메소드 테스트', () => {
    it('장소를 추가하려는 지도가 없을 경우 MapNotFoundException 을 발생시킨다.', async () => {
      await expect(
        mapService.addPlace(1, 2, 'BLUE' as Color, 'test'),
      ).rejects.toThrow(MapNotFoundException);
    });

    it('추가하려는 장소가 없을 경우 InvalidPlaceToMapException 를 발생시킨다.', async () => {
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);

      await expect(
        mapService.addPlace(1, 777777, Color.RED, 'test'),
      ).rejects.toThrow(InvalidPlaceToMapException);
    });

    it('추가하려는 장소가 이미 해당 지도에 있을경우 DuplicatePlaceToMapException 에러를 발생시킨다', async () => {
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      const publicMapEntity = await mapRepository.save(publicMap);
      const alreadyAddPlace: Place = await placeRepository.findById(
        publicMapEntity.id,
      );
      publicMapEntity.mapPlaces = [];
      publicMapEntity.addPlace(alreadyAddPlace.id, Color.RED, 'test');
      await mapRepository.save(publicMapEntity);

      await expect(
        mapService.addPlace(1, 1, Color.RED, 'test'),
      ).rejects.toThrow(DuplicatePlaceToMapException);
    });

    it('장소를 추가하려는 지도가 있을 경우 장소를 추가하고 장소 정보를 다시 반환한다.', async () => {
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      const savedMap = await mapRepository.save(publicMap);
      const addPlace = await placeRepository.findById(savedMap.id);
      const expectedResult = {
        placeId: addPlace.id,
        comment: 'test',
        color: Color.RED,
      };

      const result = await mapService.addPlace(
        1,
        expectedResult.placeId,
        expectedResult.color,
        expectedResult.comment,
      );

      expect(result).toEqual(expect.objectContaining(expectedResult));
    });
  });

  describe('deletePlace 메소드 테스트', () => {
    it('장소를 제거하려는 지도가 없을 경우 MapNotFoundException 에러를 발생시킨다.', async () => {
      await expect(mapService.deletePlace(1, 1)).rejects.toThrow(
        MapNotFoundException,
      );
    });

    it('mapId로 받은 지도에서 placeId 를 제거하고 해당 placeId 를 반환한다.', async () => {
      const publicMap = createPublicMaps(1, fakeUser1)[0];
      await mapRepository.save(publicMap);
      const expectResult = { deletedId: 1 };

      const result = await mapService.deletePlace(1, 1);

      expect(result).toEqual(expectResult);
    });
  });
});
