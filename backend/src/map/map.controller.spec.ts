import { Test, TestingModule } from '@nestjs/testing';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('MapController', () => {
  let app: INestApplication;
  let mapService = {
    searchMap: jest.fn(),
    getOwnMaps: jest.fn(),
    createMap: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MapController],
      providers: [
        {
          provide: MapService,
          useValue: mapService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET maps', () => {
    mapService.searchMap.mockResolvedValue([]);
    return request(app.getHttpServer())
      .get('/maps')
      .expect(200)
      .expect([]);
  });

  it('/GET maps/my', () => {
    mapService.getOwnMaps.mockResolvedValue([]);
    return request(app.getHttpServer())
      .get('/maps/my')
      .expect(200)
      .expect([]);
  });
