import { MapService } from '@src/map/map.service';
import { MapRepository } from '@src/map/map.repository';
import { PlaceRepository } from '@src/place/place.repository';
import { User } from '@src/user/entity/user.entity';
import { UserFixture } from '@test/user/fixture/user.fixture';
import {
  createPublicMaps,
  createPublicMapsWithTitle,
} from '@test/map/map.test.util';
import { Map } from '@src/map/entity/map.entity';
import { MapListResponse } from '@src/map/dto/MapListResponse';
import { MapNotFoundException } from '@src/map/exception/MapNotFoundException';
import { MapDetailResponse } from '@src/map/dto/MapDetailResponse';
import { CreateMapRequest } from '@src/map/dto/CreateMapRequest';
import { Color } from '@src/place/place.color.enum';
import { InvalidPlaceToMapException } from '@src/map/exception/InvalidPlaceToMapException';
import { DuplicatePlaceToMapException } from '@src/map/exception/DuplicatePlaceToMapException';
import { UserRepository } from '@src/user/user.repository';

describe('MapService 테스트', () => {
  let mapService: MapService;
  let mapRepository: jest.Mocked<MapRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let placeRepository: jest.Mocked<PlaceRepository>;
  let fakeUser1: User;
  let page: number;
  let pageSize: number;
  beforeAll(() => {
    fakeUser1 = {
      id: 1,
      ...UserFixture.createUser({ oauthId: 'abc' }),
    };
    [page, pageSize] = [1, 10];
  });
  beforeEach(async () => {
    mapRepository = {
      searchByTitleQuery: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
      update: jest.fn(),
      existById: jest.fn(),
    } as unknown as jest.Mocked<MapRepository>;
    userRepository = {
      findByProviderAndOauthId: jest.fn(),
      createUser: jest.fn(),
      findById: jest.fn(),
      existById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;
    placeRepository = {
      findByGooglePlaceId: jest.fn(),
      findAll: jest.fn(),
      searchByNameOrAddressQuery: jest.fn(),
      existById: jest.fn(),
    } as unknown as jest.Mocked<PlaceRepository>;
    mapService = new MapService(mapRepository, userRepository, placeRepository);
    userRepository.existById.mockResolvedValue(true);
  });
  describe('searchMap 메소드 테스트', () => {
    it('파라미터 중 query 가 없을 경우 공개된 모든 지도를 반환한다.', async () => {
      const mockMaps: Map[] = createPublicMaps(5, fakeUser1).map((map) => {
        return {
          ...map,
          mapPlaces: [],
        };
      });
      const spyFindAll = mapRepository.findAll.mockResolvedValue(mockMaps);
      const spyCount = mapRepository.count.mockResolvedValue(mockMaps.length);

      const result = await mapService.searchMap(undefined, 1, 10);
      const expectedMaps = await Promise.all(
        mockMaps.map(async (mockMap) => await MapListResponse.from(mockMap)),
      );
      expect(spyFindAll).toHaveBeenCalledWith(page, pageSize);
      expect(result.maps).toEqual(
        expect.arrayContaining(
          expectedMaps.map((map) => expect.objectContaining(map)),
        ),
      );
      expect(spyCount).toHaveBeenCalledWith({
        where: { title: undefined, isPublic: true },
      });
      expect(result.currentPage).toEqual(page);
      expect(result.totalPages).toEqual(Math.ceil(mockMaps.length / pageSize));
    });
    it('파라미터 중 쿼리(지도 title)가 있을 경우 해당 제목을 가진 지도들을 반환한다', async () => {
      const searchTitle = 'cool';
      const mockCoolMaps: Map[] = createPublicMapsWithTitle(
        5,
        fakeUser1,
        'cool map',
      ).map((map) => {
        return {
          ...map,
          mapPlaces: [],
        };
      });
      const spySearchByTitleQuery = jest
        .spyOn(mapRepository, 'searchByTitleQuery')
        .mockResolvedValue(mockCoolMaps);
      const spyCount = jest
        .spyOn(mapRepository, 'count')
        .mockResolvedValue(mockCoolMaps.length);
      const expectedMaps = await Promise.all(
        mockCoolMaps.map((map) => MapListResponse.from(map)),
      );
      const result = await mapService.searchMap(searchTitle, 1, 10);
      expect(spySearchByTitleQuery).toHaveBeenCalledWith(
        'cool',
        page,
        pageSize,
      );
      expect(spyCount).toHaveBeenCalledWith({
        where: { title: 'cool', isPublic: true },
      });
      expect(result.maps).toEqual(
        expect.arrayContaining(
          expectedMaps.map((map) => expect.objectContaining(map)),
        ),
      );
      expect(result.currentPage).toEqual(page);
      expect(result.totalPages).toEqual(
        Math.ceil(mockCoolMaps.length / pageSize),
      );
    });
  });
  describe('getOwnMaps 메소드 테스트', () => {
    it('유저 아이디를 파라미터로 받아서 해당 유저의 지도를 반환한다.', async () => {
      const fakeUserMaps = createPublicMaps(5, fakeUser1).map((map) => {
        return {
          ...map,
          mapPlaces: [],
        };
      });
      const spyFindUserById =
        mapRepository.findByUserId.mockResolvedValue(fakeUserMaps);
      const spyCount = mapRepository.count.mockResolvedValue(
        fakeUserMaps.length,
      );
      userRepository.findById.mockResolvedValue(fakeUser1);
      const expectedMaps = await Promise.all(
        fakeUserMaps.map((fakeUserMap) => MapListResponse.from(fakeUserMap)),
      );
      const result = await mapService.getOwnMaps(fakeUser1.id);
      expect(spyFindUserById).toHaveBeenCalledWith(
        fakeUser1.id,
        page,
        pageSize,
      );
      expect(spyCount).toHaveBeenCalledWith({
        where: { user: { id: fakeUser1.id } },
      });
      expect(result.maps).toEqual(
        expect.arrayContaining(
          expectedMaps.map((map) => expect.objectContaining(map)),
        ),
      );
      expect(result.totalPages).toEqual(
        Math.ceil(fakeUserMaps.length / pageSize),
      );
      expect(result.currentPage).toEqual(page);
    });
  });
  describe('getMapById 메소드 테스트', () => {
    it('파라미터로 받은 mapId 로 지도를 찾은 결과가 없을 때 MapNotFoundException 예외를 발생시킨다.', async () => {
      const spyFindById = mapRepository.findById.mockResolvedValue(undefined);
      await expect(mapService.getMapById(1)).rejects.toThrow(
        MapNotFoundException,
      );
      expect(spyFindById).toHaveBeenCalledWith(1);
    });
    it('파라미터로 받은 mapId 로 지도를 찾은 결과가 있으면 결과를 반환한다.', async () => {
      const publicMaps = createPublicMaps(1, fakeUser1)[0];
      publicMaps.mapPlaces = [];
      const spyFindById = mapRepository.findById.mockResolvedValue(publicMaps);
      const result = await mapService.getMapById(1);
      const expectedMap = await MapDetailResponse.from(publicMaps);
      expect(spyFindById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedMap);
    });
  });
  describe('createMap 메소드 테스트', () => {
    it('파라미터로 받은 유저 아이디로 지도를 생성하고, 지도 id 를 반환한다.', async () => {
      const spyOnFindById =
        userRepository.findById.mockResolvedValue(fakeUser1);
      const publicMap = CreateMapRequest.from({
        title: 'test map',
        description: 'This map is test map',
        isPublic: true,
        thumbnailUrl: 'basic_thumbnail.jpg',
      });
      const resolvedMap = publicMap.toEntity(fakeUser1);
      resolvedMap.mapPlaces = [];
      const spyOnSave = mapRepository.save.mockResolvedValue(resolvedMap);
      const result = await mapService.createMap(1, publicMap);
      const saveCalledWith = { ...publicMap, user: { id: 1 } };
      expect(spyOnFindById).toHaveBeenCalledWith(1);
      expect(spyOnSave).toHaveBeenCalledWith(saveCalledWith);
      expect(result).toEqual(expect.objectContaining({ id: undefined }));
    });
  });
  describe('deleteMap 메소드 테스트', () => {
    it('파라미터로 mapId를 가진 지도가 없다면 MapNotFoundException 에러를 발생시킨다.', async () => {
      const spyOnExistById = mapRepository.existById.mockResolvedValue(false);
      const spyOnSoftDelete = mapRepository.softDelete;
      await expect(mapService.deleteMap(1)).rejects.toThrow(
        MapNotFoundException,
      );
      expect(spyOnExistById).toHaveBeenCalledWith(1);
      expect(spyOnSoftDelete).not.toHaveBeenCalled();
    });

    it('파라미터로 mapId를 가진 지도가 있다면 삭제 후 삭제된 지도의 id 를 반환한다.', async () => {
      const spyOnExistById = mapRepository.existById.mockResolvedValue(true);
      const spyOnSoftDelete = mapRepository.softDelete;
      const result = await mapService.deleteMap(1);
      expect(result).toEqual({ id: 1 });
      expect(spyOnExistById).toHaveBeenCalledWith(1);
      expect(spyOnSoftDelete).toHaveBeenCalledWith(1);
    });
  });
  describe('updateMapInfo 메소드 테스트', () => {
    it('업데이트 하려는 지도가 없을경우 MapNotFoundException 에러를 발생시킨다.', async () => {
      const spyOnExistById = mapRepository.existById.mockResolvedValue(false);
      const spyOnUpdate = mapRepository.update;
      const updateInfo = {
        title: 'update test title',
        description: 'update test description',
      };
      await expect(mapService.updateMapInfo(1, updateInfo)).rejects.toThrow(
        MapNotFoundException,
      );
      expect(spyOnExistById).toHaveBeenCalledWith(1);
      expect(spyOnUpdate).not.toHaveBeenCalled();
    });
    it('업데이트 하려는 지도가 있을 경우 지도를 파라미터의 정보로 업데이트 한다.', async () => {
      const spyOnExistById = mapRepository.existById.mockResolvedValue(true);
      const spyOnUpdate = mapRepository.update;
      const updateInfo = {
        title: 'update test title',
        description: 'update test description',
      };
      await mapService.updateMapInfo(1, updateInfo);
      expect(spyOnExistById).toHaveBeenCalledWith(1);
      expect(spyOnUpdate).toBeCalledWith(1, updateInfo);
    });
  });
  describe('updateMapVisibility 메소드 테스트', () => {
    it('visibility 를 업데이트 하려는 지도가 없을 경우 MapNotFoundException 을 발생시킨다.', async () => {
      const spyOnExistById = mapRepository.existById.mockResolvedValue(false);
      const spyOnUpdate = mapRepository.update;
      await expect(mapService.updateMapVisibility(1, true)).rejects.toThrow(
        MapNotFoundException,
      );
      expect(spyOnExistById).toHaveBeenCalledWith(1);
      expect(spyOnUpdate).not.toHaveBeenCalled();
    });
    it('visibility를 업데이트 하려는 지도가 있을 경우 업데이트를 진행한다.', async () => {
      const spyOnExistById = mapRepository.existById.mockResolvedValue(true);
      const spyOnUpdate = mapRepository.update;
      await mapService.updateMapVisibility(1, true);
      expect(spyOnExistById).toHaveBeenCalledWith(1);
      expect(spyOnUpdate).toBeCalledWith(1, { isPublic: true });
    });
  });
  describe('addPlace 메소드 테스트', () => {
    it('장소를 추가하려는 지도가 없을 경우 MapNotFoundException 을 발생시킨다.', async () => {
      const spyOnFindById = mapRepository.findById.mockResolvedValue(null);
      const spyOnSave = mapRepository.save;
      await expect(
        mapService.addPlace(1, 2, 'BLUE' as Color, 'test'),
      ).rejects.toThrow(MapNotFoundException);
      expect(spyOnFindById).toHaveBeenCalledWith(1);
      expect(spyOnSave).not.toHaveBeenCalled();
    });
    it('추가하려는 장소가 없을 경우 InvalidPlaceToMapException 를 발생시킨다.', async () => {
      const map = createPublicMaps(1, fakeUser1)[0];
      const spyOnFindById = mapRepository.findById.mockResolvedValue(map);
      const spyOnPlaceExistById =
        placeRepository.existById.mockResolvedValue(false);
      await expect(
        mapService.addPlace(1, 1, 'RED' as Color, 'test'),
      ).rejects.toThrow(InvalidPlaceToMapException);
      expect(spyOnFindById).toHaveBeenCalledWith(1);
      expect(spyOnPlaceExistById).toHaveBeenCalled();
    });
    it('추가하려는 장소가 이미 해당 지도에 있을경우 DuplicatePlaceToMapException 에러를 발생시킨다', async () => {
      const map = createPublicMaps(1, fakeUser1)[0];
      map.mapPlaces = [];
      map.mapPlaces.push({ placeId: 1 });
      const spyOnFindById = mapRepository.findById.mockResolvedValue(map);
      const spyOnPlaceExistById =
        placeRepository.existById.mockResolvedValue(true);
      await expect(
        mapService.addPlace(1, 1, 'RED' as Color, 'test'),
      ).rejects.toThrow(DuplicatePlaceToMapException);
      expect(spyOnPlaceExistById).toHaveBeenCalledWith(1);
      expect(spyOnFindById).toHaveBeenCalled();
    });
    it('장소를 추가하려는 지도가 있을 경우 장소를 추가하고 장소 정보를 다시 반환한다.', async () => {
      const map = createPublicMaps(1, fakeUser1)[0];
      map.mapPlaces = [];
      const addPlace = { color: 'RED', comment: 'test', placeId: 2 };
      map.mapPlaces.push({ placeId: 1 });
      const spyOnFindById = mapRepository.findById.mockResolvedValue(map);
      const spyOnPlaceExistById =
        placeRepository.existById.mockResolvedValue(true);
      const result = await mapService.addPlace(
        1,
        addPlace.placeId,
        addPlace.color as Color,
        addPlace.comment,
      );
      expect(result).toEqual(addPlace);
      expect(spyOnFindById).toHaveBeenCalledWith(1);
      expect(spyOnPlaceExistById).toHaveBeenCalledWith(addPlace.placeId);
    });
  });
  describe('deletePlace 메소드 테스트', () => {
    it('장소를 제거하려는 지도가 없을 경우 MapNotFoundException 에러를 발생시킨다.', async () => {
      const spyFindById = mapRepository.findById.mockResolvedValue(null);
      const spyMapSave = mapRepository.save;
      await expect(mapService.deletePlace(1, 1)).rejects.toThrow(
        MapNotFoundException,
      );
      expect(spyFindById).toHaveBeenCalledWith(1);
      expect(spyMapSave).not.toHaveBeenCalled();
    });
    it('mapId로 받은 지도에서 placeId 를 제거하고 해당 placeId 를 반환한다.', async () => {
      const map = createPublicMaps(1, fakeUser1)[0];
      map.mapPlaces = [];
      map.mapPlaces.push({ placeId: 1 });
      const expectResult = { deletedId: 1 };
      const spyFindById = mapRepository.findById.mockResolvedValue(map);
      const spyMapSave = mapRepository.save;
      const result = await mapService.deletePlace(1, 1);
      expect(result).toEqual(expectResult);
      expect(spyFindById).toHaveBeenCalledWith(1);
      expect(spyMapSave).toHaveBeenCalled();
    });
  });
});
