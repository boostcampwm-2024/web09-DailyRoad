import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from '@src/place/place.service';
import { PlaceAlreadyExistsException } from '@src/place/exception/PlaceAlreadyExistsException';
import { PlaceNotFoundException } from '@src/place/exception/PlaceNotFoundException';
import { PlaceRepository } from '@src/place/place.repository';
import { PlaceCreateRequestFixture } from '@test/place/fixture/PlaceCreateRequest.fixture';
import { initDataSource } from '@test/config/datasource.config';
import { StartedMySqlContainer, MySqlContainer } from '@testcontainers/mysql';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('PlaceService', () => {
  let container: StartedMySqlContainer;
  let placeService: PlaceService;
  let placeRepository: PlaceRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext();
    container = await new MySqlContainer().withReuse().start();
    dataSource = await initDataSource(container);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: PlaceRepository,
          useValue: new PlaceRepository(dataSource),
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mocked-config-value'),
          },
        },
      ],
    }).compile();

    placeService = module.get<PlaceService>(PlaceService);
    placeRepository = module.get<PlaceRepository>(PlaceRepository);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await placeRepository.delete({});
  });

  describe('장소 등록', () => {
    beforeEach(async () => {
      await placeRepository.delete({});
    });

    it('이미 존재하는 googlePlaceId로 장소를 등록하려고 하면 예외를 던진다', async () => {
      const createPlaceRequest = PlaceCreateRequestFixture.create({
        googlePlaceId: 'googlePlaceId_1',
        name: 'Central Park',
        formattedAddress: 'New York',
      });

      await placeRepository.save(createPlaceRequest.toEntity());

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

      const result = await placeService.addPlace(createPlaceRequest);

      expect(result).toHaveProperty('id');
      expect(result.id).toBeDefined();
    });
  });

  describe('장소 검색', () => {
    beforeEach(async () => {
      await placeRepository.delete({});
    });

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
    beforeEach(async () => {
      await placeRepository.delete({});
    });

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
