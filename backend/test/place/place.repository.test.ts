import { PlaceRepository } from '../../src/place/place.repository';
import { initDataSource } from '../config/datasource.config';
import { PlaceFixture } from './fixture/place.fixture';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';

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
});
