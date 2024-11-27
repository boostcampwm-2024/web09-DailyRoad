import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { MapRepository } from '@src/map/map.repository';
import { DataSource } from 'typeorm';
import { User } from '@src/user/entity/user.entity';
import { initDataSource } from '@test/config/datasource.config';
import { UserFixture } from '@test/user/fixture/user.fixture';
import { MapFixture } from '@test/map/fixture/map.fixture';
import { initializeTransactionalContext } from 'typeorm-transactional';
import {
  createPlace,
  createPrivateMaps,
  createPublicMaps,
} from '@test/map/map.test.util';
import { PlaceRepository } from '@src/place/place.repository';
import { MapPlace } from '@src/map/entity/map-place.entity';
import { Color } from '@src/place/color.enum';

describe('MapRepository', () => {
  let container: StartedMySqlContainer;
  let mapRepository: MapRepository;
  let placeRepository: PlaceRepository;
  let dataSource: DataSource;
  let fakeUser1: User;
  let fakeUser2: User;
  beforeAll(async () => {
    container = await new MySqlContainer().withReuse().start();
    dataSource = await initDataSource(container);
    initializeTransactionalContext();

    fakeUser1 = UserFixture.createUser({ oauthId: 'abc' });
    fakeUser2 = UserFixture.createUser({ oauthId: 'def' });

    mapRepository = new MapRepository(dataSource);
    placeRepository = new PlaceRepository(dataSource);

    await dataSource.getRepository(User).delete({});
    await dataSource.getRepository(User).save([fakeUser1, fakeUser2]);
    const places = createPlace(5);
    await placeRepository.save(places);
  });
  beforeEach(async () => {
    await mapRepository.delete({});
  });
  afterAll(async () => {
    await mapRepository.delete({});
    await placeRepository.delete({});
    await dataSource.getRepository(User).delete({});
    await dataSource.destroy();
  });
  it('공개되어 있는 지도 모두 반환한다.', async () => {
    const { publicMaps, privateMaps } = createPublicPrivateMaps();
    const maps = [...publicMaps, ...privateMaps].map(({ title, isPublic }) =>
      MapFixture.createMap({ user: fakeUser1, title, isPublic }),
    );
    await mapRepository.save(maps);

    const findMaps = await mapRepository.findAll(1, 10);

    expect(findMaps).toHaveLength(publicMaps.length);
    expect(findMaps).toEqual(
      expect.arrayContaining(
        publicMaps.map((publicMap) => expect.objectContaining(publicMap)),
      ),
    );
  });
  it('공개되어 있는 지도를 검색했을 때 정확한 페이지와 페이지의 지도를 전달한다', async () => {
    const fiftyPublicMaps = createPublicMaps(50, fakeUser1);
    await mapRepository.save(fiftyPublicMaps);
    const [page, pageSize] = [5, 5];
    const expectedMaps = fiftyPublicMaps.slice(20, 25);

    const fifthPageMaps = await mapRepository.findAll(page, pageSize);

    expect(fifthPageMaps).toEqual(
      expect.arrayContaining(
        expectedMaps.map((expectedMap) => expect.objectContaining(expectedMap)),
      ),
    );
  });
  describe('searchByTitleQuery 메소드 테스트', () => {
    it('대소문자 구분없이 제목으로 지도를 검색할 수 있다', async () => {
      const searchedMaps = [
        { title: 'TESTMap', isPublic: true },
        { title: 'testMap', isPublic: true },
        { title: 'TeStMap', isPublic: true },
      ];
      const unSearchedMaps = [
        { title: 'TOASTMap', isPublic: true },
        { title: 'toastMap', isPublic: true },
        { title: 'ToAsTMap', isPublic: true },
      ];
      const maps = [...searchedMaps, ...unSearchedMaps].map(
        ({ title, isPublic }) =>
          MapFixture.createMap({ user: fakeUser1, title, isPublic }),
      );
      await mapRepository.save(maps);
      const [title, page, pageSize] = ['test', 1, 10];

      const MapsWithTestTitle = await mapRepository.searchByTitleQuery(
        title,
        page,
        pageSize,
      );

      expect(MapsWithTestTitle).toEqual(
        expect.arrayContaining(
          searchedMaps.map((searchedMap) =>
            expect.objectContaining(searchedMap),
          ),
        ),
      );
    });
    it('제목으로 지도를 검색했을 때 공개된 지도만 반환한다.', async () => {
      const { publicMaps, privateMaps } = createPublicPrivateMaps();
      const maps = [...publicMaps, ...privateMaps].map(({ title, isPublic }) =>
        MapFixture.createMap({ user: fakeUser1, title, isPublic }),
      );
      await mapRepository.save(maps);
      const [title, page, pageSize] = ['test', 1, 5];

      const mapsWithTest = await mapRepository.searchByTitleQuery(
        title,
        page,
        pageSize,
      );

      expect(mapsWithTest).toEqual(
        expect.arrayContaining(
          publicMaps.map((publicMap) => expect.objectContaining(publicMap)),
        ),
      );
    });
    it('제목으로 지도를 검색했을 때 정확한 페이지의 크기와 페이지의 내용이 전달한다', async () => {
      const fiftyMaps = createPublicMaps(50, fakeUser1);
      await mapRepository.save(fiftyMaps);
      const [title, page, pageSize] = ['test', 5, 5];
      const expected = fiftyMaps.slice(20, 25);

      const received = await mapRepository.searchByTitleQuery(
        title,
        page,
        pageSize,
      );

      expect(received).toEqual(
        expect.arrayContaining(
          expected.map((map) => expect.objectContaining(map)),
        ),
      );
    });
  });
  describe('findMapsWithPlace 메소드 테스트', () => {
    it('지도와 장소를 조인하여 공개되고 장소를 가지고 있는 지도들을 반환한다.', async () => {
      const publicMaps = createPublicMaps(5, fakeUser1);
      const publicMapsWithPlaces = createPublicMaps(5, fakeUser1);
      const privateMapsWithPlaces = createPrivateMaps(5, fakeUser1);

      publicMapsWithPlaces.forEach((publicMapWithPlaces) => {
        publicMapWithPlaces.mapPlaces = [
          MapPlace.of(1, publicMapWithPlaces, 'RED' as Color, 'test'),
        ];
      });
      privateMapsWithPlaces.forEach((privateMapsWithPlaces) => {
        privateMapsWithPlaces.mapPlaces = [
          MapPlace.of(1, privateMapsWithPlaces, 'RED' as Color, 'test'),
        ];
      });

      const mapEntities = await mapRepository.save([
        ...publicMaps,
        ...publicMapsWithPlaces,
        ...privateMapsWithPlaces,
      ]);
      const expectedMaps = mapEntities.slice(5, 10).map((map) => {
        return {
          ...map,
          mapPlaces: map.mapPlaces.map((place) => {
            return {
              color: place.color,
              createdAt: place.createdAt,
              deletedAt: place.deletedAt,
              updatedAt: place.updatedAt,
              description: place.description,
              id: place.id,
              placeId: place.placeId,
            };
          }),
        };
      });

      const result = await mapRepository.findMapsWithPlace(1, 15);

      expect(result).toEqual(
        expect.arrayContaining(
          expectedMaps.map((map) => expect.objectContaining(map)),
        ),
      );
    });
    describe('countMapsWithPlace 메소드 테스트', () => {
      it('지도와 장소를 조인하여 공개되고 장소를 가지고 있는 지도의 개수를 반환한다.', async () => {
        const publicMaps = createPublicMaps(5, fakeUser1);
        const publicMapsWithPlaces = createPublicMaps(5, fakeUser1);
        const privateMapsWithPlaces = createPrivateMaps(5, fakeUser1);

        publicMapsWithPlaces.forEach((publicMapWithPlaces) => {
          publicMapWithPlaces.mapPlaces = [
            MapPlace.of(1, publicMapWithPlaces, 'RED' as Color, 'test'),
          ];
        });
        privateMapsWithPlaces.forEach((privateMapsWithPlaces) => {
          privateMapsWithPlaces.mapPlaces = [
            MapPlace.of(1, privateMapsWithPlaces, 'RED' as Color, 'test'),
          ];
        });
        await mapRepository.save([
          ...publicMaps,
          ...publicMapsWithPlaces,
          ...privateMapsWithPlaces,
        ]);

        const result = await mapRepository.countMapsWithPlace();

        expect(result).toBe(publicMapsWithPlaces.length);
      });
    });
    describe('findByUserId 메소드 테스트', () => {
      it('유저의 아이디로 유저가 만든 공개/비공개 모든 지도를 검색할 수 있다', async () => {
        const publicFirstFakeUsers = createPublicMaps(5, fakeUser1);
        const privateFirstUsers = createPrivateMaps(3, fakeUser1);
        const secondFakeUsers = createPublicMaps(3, fakeUser2);
        await mapRepository.save([
          ...publicFirstFakeUsers,
          ...secondFakeUsers,
          ...privateFirstUsers,
        ]);
        const [userId, page, pageSize] = [fakeUser1.id, 1, 10];

        const findFirstFakeUsers = await mapRepository.findByUserId(
          userId,
          page,
          pageSize,
        );

        expect(findFirstFakeUsers).toEqual(
          expect.arrayContaining(
            [...publicFirstFakeUsers, ...privateFirstUsers].map(
              (firstFakeUserMap) => expect.objectContaining(firstFakeUserMap),
            ),
          ),
        );
      });
      it('유저의 아이디로 검색했을 때 정확한 페이지의 내용이 전달되어야 한다', async () => {
        const publicFirstUsers = createPublicMaps(50, fakeUser1);
        const [userId, page, pageSize] = [fakeUser1.id, 5, 5];
        await mapRepository.save(publicFirstUsers);
        const expectedMaps = publicFirstUsers.slice(20, 25);
        expectedMaps.forEach((expectedMap) => {
          expectedMap.mapPlaces = [];
        });

        const firstUsersFifthPage = await mapRepository.findByUserId(
          userId,
          page,
          pageSize,
        );

        expect(firstUsersFifthPage).toEqual(
          expect.arrayContaining(
            expectedMaps.map((expectedMap) =>
              expect.objectContaining(expectedMap),
            ),
          ),
        );
      });
    });
  });
});

function createPublicPrivateMaps() {
  return {
    publicMaps: [
      { title: 'public test map 1', isPublic: true },
      { title: 'public test map 2', isPublic: true },
      { title: 'public test map 3', isPublic: true },
    ],
    privateMaps: [
      { title: 'private test map 1', isPublic: false },
      { title: 'private test map 2', isPublic: false },
      { title: 'private test map 3', isPublic: false },
    ],
  };
}
