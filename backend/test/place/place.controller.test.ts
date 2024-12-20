import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PlaceService } from '@src/place/PlaceService';
import { PlaceCreateRequestFixture } from '@test/place/fixture/PlaceCreateRequest.fixture';
import { DataSource } from 'typeorm';
import { SearchService } from '@src/search/SearchService';
import {
  initializeIntegrationTestEnvironment,
  truncateTables,
} from '@test/config/utils';
import { JWTHelper } from '@src/auth/JWTHelper';
import { UserFixture } from '@test/user/fixture/user.fixture';
import { User } from '@src/user/entity/User';

describe('PlaceController', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let placeService: PlaceService;
  let searchService: SearchService;
  let jwtHelper: JWTHelper;
  let token: string;
  let fakeUser1: User;

  beforeAll(async () => {
    ({ app, dataSource } = await initializeIntegrationTestEnvironment());
    placeService = app.get<PlaceService>(PlaceService);
    searchService = app.get<SearchService>(SearchService);
    fakeUser1 = UserFixture.createUser({ oauthId: 'abc' });
    jwtHelper = app.get<JWTHelper>(JWTHelper);
    const userInfo = {
      userId: fakeUser1.id,
      role: fakeUser1.role,
    };
    token = jwtHelper.generateToken('24h', userInfo);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await truncateTables(dataSource);
  });

  describe('장소 검색', () => {
    it('페이지, 사이즈를 설정하지 않았을 경우 기본값을 사용하여 장소를 반환한다', async () => {
      const query = 'test';
      const serviceResult = await placeService.getPlaces(query, 1, 5);

      const response = await request(app.getHttpServer())
        .get('/places')
        .query({ query })
        .expect(200);

      expect(response.body).toEqual(serviceResult);
    });

    it('페이지, 사이즈 값을 설정한 경우 해당 값을 사용하여 장소를 반환한다', async () => {
      const defaultPlace1 = PlaceCreateRequestFixture.create({
        googlePlaceId: 'googlePlaceId_1',
        name: 'Central Park',
      });
      const defaultPlace2 = PlaceCreateRequestFixture.create({
        googlePlaceId: 'googlePlaceId_2',
        name: 'Times Square',
      });

      jest.spyOn(searchService, 'savePlace').mockResolvedValue(undefined);
      await placeService.savePlace(defaultPlace1);
      await placeService.savePlace(defaultPlace2);

      const query = 'test';
      const serviceResult = await placeService.getPlaces(query, 2, 1);

      const response = await request(app.getHttpServer())
        .get('/places')
        .query({ query: 'test', page: 2, limit: 1 })
        .expect(200);

      expect(response.body).toEqual(serviceResult);
    });

    // Todo. 숫자가 아닌 값을 페이지로 입력했을 경우 400 에러를 응답한다. -> transformer 이슈 해결 필요
  });

  describe('장소 등록', () => {
    it('유효한 장소 생성 폼으로 장소 등록에 성공한다', async () => {
      const createPlaceDto = PlaceCreateRequestFixture.create({
        googlePlaceId: 'googlePlaceId_3',
        name: 'Statue of Liberty',
      });

      const res = await request(app.getHttpServer())
        .post('/places')
        .set('Authorization', `Bearer ${token}`)
        .send(createPlaceDto);
      expect(res.status).toEqual(201);
    });

    it('유효하지 않은 장소 생성 폼을 입력한 경우 400 에러를 응답한다', async () => {
      const invalidPlaceDto = { name: '' };

      const response = await request(app.getHttpServer())
        .post('/places')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidPlaceDto)
        .expect(400);

      expect(response.body.message).toContain('googlePlaceId must be a string');
    });

    it('로그인하지 않은 경우 장소를 등록할 수 없다', async () => {
      // Todo. 작성
    });
  });

  describe('장소 조회', () => {
    it('존재하는 장소 ID로 장소 조회에 성공한다', async () => {
      const defaultPlace = PlaceCreateRequestFixture.create();
      await placeService.savePlace(defaultPlace);

      const place = await placeService
        .getPlaces(undefined, 1, 5)
        .then((res) => res[0]);

      const response = await request(app.getHttpServer())
        .get(`/places/${place.id}`)
        .expect(200);

      const serviceResult = await placeService.getPlace(place.id);
      expect(response.body).toEqual(serviceResult);
    });
  });

  it('존재하지 않는 id로 장소를 조회하려고 하면 404 에러를 응답한다', async () => {
    await request(app.getHttpServer()).get('/places/999').expect(404);
  });
});
