import { Injectable } from '@nestjs/common';
import { MapRepository } from './map.repository';
import { User } from '../user/user.entity';
import { CreateMapForm } from './dto/CreateMapForm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MapListResponse } from './dto/MapListResponse';

@Injectable()
export class MapService {
  constructor(private readonly mapRepository: MapRepository,
              @InjectRepository(User) private readonly userRepository: Repository<User>) {

    // Todo. 로그인 기능 완성 후 제거
    const testUser = new User('test', 'test', 'test', 'test');
    testUser.id = 1;
    userRepository.upsert(
      testUser,
      { conflictPaths: ['id'] },
    );
  }

  // Todo. 작성자명 등 ... 검색 조건 추가
  async searchMap(query?: string, page: number = 1, pageSize: number = 10) {
    const maps = query
      ? await this.mapRepository.searchByTitleQuery(query, page, pageSize)
      : await this.mapRepository.findAll(page, pageSize);

    const totalCount = await this.mapRepository.count({ where: { title: query, isPublic: true } });

    const publicMaps = maps.filter((map) => map.isPublic);

    return {
      maps: await Promise.all(publicMaps.map(MapListResponse.from)),
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    };
  }

  async getOwnMaps(userId: number, page: number = 1, pageSize: number = 10) {
    // Todo. 그룹 기능 추가
    const totalCount = await this.mapRepository.count({ where: { user: { id: userId } } });

    const ownMaps = await this.mapRepository.findByUserId(userId, page, pageSize);

    return {
      maps: await Promise.all(ownMaps.map(MapListResponse.from)),
      totalPages: Math.ceil((totalCount / pageSize)),
      currentPage: page,
    };
  }

  async getMapById(id: number) {
    return this.mapRepository.findById(id);
  }
