import { Injectable } from '@nestjs/common';
import { MapRepository } from './map.repository';
import { User } from '../user/user.entity';
import { MapListResponse } from './dto/MapListResponse';
import { MapDetailResponse } from './dto/MapDetailResponse';
import { UserRepository } from '../user/user.repository';
import { DataSource } from 'typeorm';
import { CreateMapRequest } from './dto/CreateMapRequest';
import { UpdateMapInfoRequest } from './dto/UpdateMapInfoRequest';
import { MapNotFoundException } from './exception/MapNotFoundException';

@Injectable()
export class MapService {
  private readonly userRepository: UserRepository;

  constructor(
    private readonly mapRepository: MapRepository,
    private readonly dataSource: DataSource,
  ) {
    this.userRepository = new UserRepository(this.dataSource);
    // Todo. 로그인 기능 완성 후 제거
    const testUser = new User('test', 'test', 'test', 'test');
    testUser.id = 1;
    this.userRepository.upsert(testUser, { conflictPaths: ['id'] });
  }

  // Todo. 작성자명 등 ... 검색 조건 추가
  async searchMap(query?: string, page: number = 1, pageSize: number = 10) {
    const maps = query
      ? await this.mapRepository.searchByTitleQuery(query, page, pageSize)
      : await this.mapRepository.findAll(page, pageSize);

    const totalCount = await this.mapRepository.count({
      where: { title: query, isPublic: true },
    });

    const publicMaps = maps.filter((map) => map.isPublic);

    return {
      maps: await Promise.all(publicMaps.map(MapListResponse.from)),
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  }

  async getOwnMaps(userId: number, page: number = 1, pageSize: number = 10) {
    // Todo. 그룹 기능 추가
    const totalCount = await this.mapRepository.count({
      where: { user: { id: userId } },
    });

    const ownMaps = await this.mapRepository.findByUserId(
      userId,
      page,
      pageSize,
    );

    return {
      maps: await Promise.all(ownMaps.map(MapListResponse.from)),
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  }

  async getMapById(id: number) {
    const map = await this.mapRepository.findById(id);
    if (map) return await MapDetailResponse.from(map);

    throw new Error('커스텀에러로수정예정 404');
  }

  async createMap(userId: number, createMapForm: CreateMapRequest) {
    const user = { id: userId } as User;
    const map = createMapForm.toEntity(user);

    return { id: (await this.mapRepository.save(map)).id };
  }

  async deleteMap(id: number) {
    await this.checkExists(id);

    await this.mapRepository.softDelete(id);
    return { id };
  }

  async updateMapInfo(id: number, updateMapForm: UpdateMapInfoRequest) {
    await this.checkExists(id);

    const { title, description } = updateMapForm;
    return this.mapRepository.update(id, { title, description });
  }

  async updateMapVisibility(id: number, isPublic: boolean) {
    await this.checkExists(id);

    return this.mapRepository.update(id, { isPublic });
  }

  private async checkExists(id: number) {
    if (!(await this.mapRepository.existById(id)))
      throw new MapNotFoundException(id);
  }
}
