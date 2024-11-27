import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from '@src/place/place.service';
import { PlaceAlreadyExistsException } from '@src/place/exception/PlaceAlreadyExistsException';
import { PlaceNotFoundException } from '@src/place/exception/PlaceNotFoundException';
import { PlaceRepository } from '@src/place/place.repository';
import { PlaceCreateRequestFixture } from '@test/place/fixture/PlaceCreateRequest.fixture';
import { initDataSource } from '@test/config/datasource.config';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SearchService } from '@src/search/search.service';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { truncateTables } from '@test/config/utils';

describe('PlaceService', () => {
  let container: StartedMySqlContainer;
  let dataSource: DataSource;

  let placeService: PlaceService;
  let placeRepository: PlaceRepository;
  let searchService: SearchService;

  beforeAll(async () => {
    initializeTransactionalContext();
    container = await new MySqlContainer().withReuse().start();
    dataSource = await initDataSource(container);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            },
            level: 'debug',
          },
        }),
      ],
      providers: [
        PlaceService,
        {
          provide: PlaceRepository,
          useValue: new PlaceRepository(dataSource),
        },
        {
          provide: SearchService,
          useValue: {
            savePlace: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mocked-config-value'),
          },
        },
        {
          provide: PinoLogger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    placeService = module.get<PlaceService>(PlaceService);
    placeRepository = module.get<PlaceRepository>(PlaceRepository);
    searchService = module.get<SearchService>(SearchService);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await truncateTables(dataSource);
  });

  describe('장소 등록', () => {
    it('이미 존재하는 googlePlaceId로 장소를 등록하려고 하면 예외를 던진다', async () => {
      const createPlaceRequest = PlaceCreateRequestFixture.create({
        googlePlaceId: 'googlePlaceId_1',
        name: 'Central Park',
        formattedAddress: 'New York',
      });

      const place = createPlaceRequest.toEntity();
      await placeRepository.save(place);
      jest.spyOn(searchService, 'savePlace').mockResolvedValue(undefined);

      await expect(placeService.addPlace(createPlaceRequest)).rejects.toThrow(
        PlaceAlreadyExistsException,
      );
    });

    it('새로운 장소를 성공적으로 등록한다', async () => {
      const createPlaceRequest = PlaceCreateRequestFixture.create({
        googlePlaceId: 'googlePlaceId_2',
        name: 'Tower Park',
        formattedAddress: 'London',
      });
      await searchService.savePlace(createPlaceRequest.toEntity());

      const result = await placeService.addPlace(createPlaceRequest);

      expect(result).toHaveProperty('id');
      expect(result.id).toBeDefined();
    });
  });

  describe('장소 검색', () => {
    it('쿼리가 없는 경우 전체 장소를 페이지네이션하여 반환한다', async () => {
      await placeRepository.save(
        PlaceCreateRequestFixture.create({
          googlePlaceId: 'googlePlaceId_1',
          name: 'Central Park',
          formattedAddress: 'New York',
        }).toEntity(),
      );
      await placeRepository.save(
        PlaceCreateRequestFixture.create({
          googlePlaceId: 'googlePlaceId_2',
          name: 'Tower Park',
          formattedAddress: 'London',
        }).toEntity(),
      );

      const result = await placeService.getPlaces(undefined, 1, 10);

      expect(result.length).toBe(2);
      expect(result.map((place) => place.google_place_id)).toEqual([
        'googlePlaceId_1',
        'googlePlaceId_2',
      ]);
    });

    it('쿼리가 있는 경우 이름이나 주소에 포함된 장소만 반환한다', async () => {
      await placeRepository.save(
        PlaceCreateRequestFixture.create({
          googlePlaceId: 'googlePlaceId_1',
          name: 'Central Park',
          formattedAddress: 'New York',
        }).toEntity(),
      );
      await placeRepository.save(
        PlaceCreateRequestFixture.create({
          googlePlaceId: 'googlePlaceId_2',
          name: 'Tower Park',
          formattedAddress: 'London',
        }).toEntity(),
      );
      await placeRepository.save(
        PlaceCreateRequestFixture.create({
          googlePlaceId: 'googlePlaceId_3',
          name: 'Eiffel Tower',
          formattedAddress: 'Paris',
        }).toEntity(),
      );

      const result = await placeService.getPlaces('Tower', 1, 10);

      expect(result.length).toBe(2);
      expect(result.map((place) => place.google_place_id)).toEqual([
        'googlePlaceId_2',
        'googlePlaceId_3',
      ]);
    });

    it('쿼리가 없는 경우 결과가 없으면 빈 배열을 반환한다', async () => {
      const result = await placeService.getPlaces(undefined, 1, 10);

      expect(result).toEqual([]);
    });

    it('쿼리가 있는 경우 결과가 없으면 빈 배열을 반환한다', async () => {
      const result = await placeService.getPlaces('NonExistentQuery', 1, 10);

      expect(result).toEqual([]);
    });
  });

  describe('장소 조회', () => {
    it('존재하지 않는 id로 장소를 조회하려고 하면 예외를 던진다', async () => {
      const nonExistentId = 999;

      await expect(placeService.getPlace(nonExistentId)).rejects.toThrow(
        PlaceNotFoundException,
      );
    });

    it('존재하는 id로 장소를 조회하면 성공적으로 반환한다', async () => {
      const savedPlace = await placeRepository.save(
        PlaceCreateRequestFixture.create({
          googlePlaceId: 'googlePlaceId_1',
          name: 'Central Park',
          formattedAddress: 'New York',
        }).toEntity(),
      );

      const result = await placeService.getPlace(savedPlace.id);

      expect(result).toHaveProperty('id', savedPlace.id);
      expect(result).toHaveProperty('name', 'Central Park');
      expect(result).toHaveProperty('formed_address', 'New York');
    });
  });
});
