import { PlaceFixture } from './fixture/place.fixture';
import { StartedMySqlContainer, MySqlContainer } from '@testcontainers/mysql';
import { PlaceRepository } from '../../src/place/place.repository';
import { initDataSource } from '../config/datasource.config';

describe('PlaceRepository', () => {
  let container: StartedMySqlContainer;
  let placeRepository: PlaceRepository;

  beforeAll(async () => {
    container = await new MySqlContainer().withReuse().start();
    placeRepository = new PlaceRepository(await initDataSource(container));
  });

  beforeEach(async () => {
    await placeRepository.delete({});
  });

  describe('데이터 저장 및 무결성', () => {
    it('중복된 googlePlaceId를 저장할 수 없다', async () => {
      const place = PlaceFixture.createPlace({ googlePlaceId: 'duplicate_id' });
      await placeRepository.save([place]);

      const duplicatePlace = PlaceFixture.createPlace({
        googlePlaceId: 'duplicate_id',
      });

      await expect(placeRepository.save([duplicatePlace])).rejects.toThrow();
    });

    it('null 값으로 장소를 저장하려고 하면 예외를 던진다', async () => {
      const invalidPlace = PlaceFixture.createPlace({
        googlePlaceId: null,
        name: null,
        formattedAddress: null,
      });

      await expect(placeRepository.save([invalidPlace])).rejects.toThrow();
    });
  });

  describe('findAll 메서드', () => {
    it('페이지 번호와 페이지 크기를 기준으로 모든 장소를 반환한다', async () => {
      const places = [
        PlaceFixture.createPlace({ googlePlaceId: 'googlePlaceId_1' }),
        PlaceFixture.createPlace({ googlePlaceId: 'googlePlaceId_2' }),
        PlaceFixture.createPlace({ googlePlaceId: 'googlePlaceId_3' }),
      ];

      await placeRepository.save(places);

      const page = 1;
      const pageSize = 2;
      const results = await placeRepository.findAll(page, pageSize);

      expect(results.length).toBe(pageSize);
      expect(results).toEqual(
        expect.arrayContaining(
          places
            .slice(0, pageSize)
            .map((place) =>
              expect.objectContaining({ googlePlaceId: place.googlePlaceId }),
            ),
        ),
      );
    });

    it('페이지 번호가 0 이하일 경우 예외를 던진다', async () => {
      const page = 0;
      const pageSize = 2;

      await expect(placeRepository.findAll(page, pageSize)).rejects.toThrow();
    });

    it('페이지 크기가 0 이하일 경우 예외를 던진다', async () => {
      const page = 1;
      const pageSize = 0;

      await expect(placeRepository.findAll(page, pageSize)).rejects.toThrow();
    });

    it('결과가 없을 경우 빈 배열을 반환한다', async () => {
      const page = 1;
      const pageSize = 2;

      const results = await placeRepository.findAll(page, pageSize);

      expect(results).toEqual([]);
    });

    it('페이지 크기가 매우 클 경우에도 정상적으로 작동한다', async () => {
      const places = Array.from({ length: 50 }, (_, i) =>
        PlaceFixture.createPlace({
          googlePlaceId: `googlePlaceId_${i + 1}`,
          name: `Place ${i + 1}`,
          formattedAddress: `Address ${i + 1}`,
        }),
      );

      await placeRepository.save(places);

      const results = await placeRepository.findAll(1, 1000);

      expect(results.length).toBe(50);
    });
  });

  describe('findByGooglePlaceId 메서드', () => {
    it('주어진 googlePlaceId에 해당하는 장소를 반환한다', async () => {
      const place = PlaceFixture.createPlace({
        googlePlaceId: 'unique_google_place_id',
      });
      await placeRepository.save([place]);

      const result = await placeRepository.findByGooglePlaceId(
        'unique_google_place_id',
      );

      expect(result).toEqual(
        expect.objectContaining({ googlePlaceId: 'unique_google_place_id' }),
      );
    });

    it('존재하지 않는 googlePlaceId를 조회하면 null을 반환한다', async () => {
      const result =
        await placeRepository.findByGooglePlaceId('non_existent_id');
      expect(result).toBeNull();
    });
  });

  describe('searchByNameOrAddressQuery 메서드', () => {
    it('장소 이름이나 주소에 포함된 키워드를 찾아 해당하는 장소를 반환한다', async () => {
      const placesWithParkName = [
        {
          googlePlaceId: 'googlePlaceId_1',
          name: 'Central Park',
          formattedAddress: 'New York, NY, USA',
        },
        {
          googlePlaceId: 'googlePlaceId_2',
          name: 'Tower Park',
          formattedAddress: 'London, UK',
        },
      ];
      const placesWithParkAddress = [
        {
          googlePlaceId: 'googlePlaceId_3',
          name: 'Eiffel Tower',
          formattedAddress: 'Park Avenue, New York, NY, USA',
        },
      ];
      const placesEtc = [
        {
          googlePlaceId: 'googlePlaceId_4',
          name: 'Seoul Forest',
          formattedAddress: 'Seoul, South Korea',
        },
      ];

      const places = [
        ...placesWithParkName,
        ...placesWithParkAddress,
        ...placesEtc,
      ].map(({ googlePlaceId, name, formattedAddress }) =>
        PlaceFixture.createPlace({ googlePlaceId, name, formattedAddress }),
      );
      await placeRepository.save(places);

      const page = 1;
      const pageSize = 10;
      const query = 'park';
      const results = await placeRepository.searchByNameOrAddressQuery(
        query,
        page,
        pageSize,
      );

      expect(results.length).toBe(3);

      expect(results).toEqual(
        expect.arrayContaining(
          [...placesWithParkName, ...placesWithParkAddress].map((place) =>
            expect.objectContaining(place),
          ),
        ),
      );

      expect(results).not.toEqual(
        expect.arrayContaining(
          placesEtc.map((place) => expect.objectContaining(place)),
        ),
      );
    });

    it('검색 키워드는 대소문자를 구분하지 않는다', async () => {
      const place = PlaceFixture.createPlace({
        googlePlaceId: 'googlePlaceId_1',
        name: 'Park View',
        formattedAddress: 'New York, NY, USA',
      });

      await placeRepository.save([place]);

      const results = await placeRepository.searchByNameOrAddressQuery(
        'PARK',
        1,
        10,
      );

      expect(results.length).toBe(1);
      expect(results[0]).toEqual(
        expect.objectContaining({ name: 'Park View' }),
      );
    });

    it('검색 키워드가 빈 문자열일 경우 빈 배열을 반환한다', async () => {
      const results = await placeRepository.searchByNameOrAddressQuery(
        '',
        1,
        10,
      );
      expect(results).toEqual([]);
    });

    it('결과가 너무 많을 경우 페이지 크기만큼만 반환한다', async () => {
      const places = Array.from({ length: 20 }, (_, i) =>
        PlaceFixture.createPlace({
          googlePlaceId: `googlePlaceId_${i + 1}`,
          name: `Place ${i + 1}`,
          formattedAddress: `Address ${i + 1}`,
        }),
      );

      await placeRepository.save(places);

      const results = await placeRepository.searchByNameOrAddressQuery(
        'Place',
        1,
        10,
      );

      expect(results.length).toBe(10);
    });
  });

  describe('SoftDelete 연동', () => {
    it('소프트 삭제된 장소는 검색 결과에 포함되지 않는다', async () => {
      const place = PlaceFixture.createPlace({
        googlePlaceId: 'soft_deleted_id',
      });
      await placeRepository.save([place]);

      await placeRepository.softDelete(place.id);

      const results = await placeRepository.findAll(1, 10);

      expect(results).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ googlePlaceId: 'soft_deleted_id' }),
        ]),
      );
    });
  });
});
