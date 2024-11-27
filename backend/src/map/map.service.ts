import { Injectable } from '@nestjs/common';
import { MapRepository } from '@src/map/map.repository';
import { User } from '@src/user/entity/user.entity';
import { MapListResponse } from '@src/map/dto/MapListResponse';
import { MapDetailResponse } from '@src/map/dto/MapDetailResponse';
import { UserRepository } from '@src/user/user.repository';
import { UpdateMapInfoRequest } from '@src/map/dto/UpdateMapInfoRequest';
import { CreateMapRequest } from '@src/map/dto/CreateMapRequest';
import { MapNotFoundException } from '@src/map/exception/MapNotFoundException';
import { DuplicatePlaceToMapException } from '@src/map/exception/DuplicatePlaceToMapException';
import { PlaceRepository } from '@src/place/place.repository';
import { InvalidPlaceToMapException } from '@src/map/exception/InvalidPlaceToMapException';
import { Map } from '@src/map/entity/map.entity';
import { Color } from '@src/place/place.color.enum';
import { Transactional } from 'typeorm-transactional';
import { PagedMapResponse } from '@src/map/dto/PagedMapResponse';

@Injectable()
export class MapService {
  constructor(
    private readonly mapRepository: MapRepository,
    private readonly userRepository: UserRepository,
    private readonly placeRepository: PlaceRepository,
  ) {}

  async searchMap(query?: string, page: number = 1, pageSize: number = 15) {
    const maps = await this.mapRepository.searchByTitleQuery(
      query,
      page,
      pageSize,
    );

    const totalCount = await this.mapRepository.countByTitle(query);

    return new PagedMapResponse(
      await Promise.all(maps.map(MapListResponse.from)),
      totalCount,
      page,
      pageSize,
    );
  }

  async getAllMaps(page: number = 1, pageSize: number = 15) {
    const totalCount = await this.mapRepository.countMapsWithPlace();
    const maps = await this.mapRepository.findMapsWithPlace(page, pageSize);

    return new PagedMapResponse(
      await Promise.all(maps.map(MapListResponse.from)),
      totalCount,
      page,
      pageSize,
    );
  }

  async getOwnMaps(userId: number, page: number = 1, pageSize: number = 10) {
    const totalCount = await this.mapRepository.countByUserId(userId);

    const ownMaps = await this.mapRepository.findByUserId(
      userId,
      page,
      pageSize,
    );

    return new PagedMapResponse(
      await Promise.all(ownMaps.map(MapListResponse.from)),
      totalCount,
      page,
      pageSize,
    );
  }

  async getMapById(id: number) {
    const map = await this.mapRepository.findById(id);
    if (!map) throw new MapNotFoundException(id);

    return await MapDetailResponse.from(map);
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

  async addPlace(
    id: number,
    placeId: number,
    color = Color.RED,
    comment?: string,
  ) {
    const map = await this.mapRepository.findById(id);
    if (!map) throw new MapNotFoundException(id);
    await this.validatePlacesForMap(placeId, map);

    map.addPlace(placeId, color, comment);
    await this.mapRepository.save(map);

    return {
      comment,
      color,
      placeId: placeId,
    };
  }

  @Transactional()
  async updatePlace(
    id: number,
    placeId: number,
    color?: Color,
    comment?: string,
  ) {
    const map = await this.getMapOrElseThrowNotFound(id);
    map.updatePlace(placeId, color, comment);

    return this.mapRepository.save(map);
  }

  async deletePlace(id: number, placeId: number) {
    const map = await this.getMapOrElseThrowNotFound(id);

    map.deletePlace(placeId);
    await this.mapRepository.save(map);

    return { deletedId: placeId };
  }

  private async getMapOrElseThrowNotFound(id: number) {
    const map = await this.mapRepository.findById(id);
    if (!map) {
      throw new MapNotFoundException(id);
    }
    return map;
  }

  private async checkExists(id: number) {
    if (!(await this.mapRepository.existById(id))) {
      throw new MapNotFoundException(id);
    }
  }

  private async validatePlacesForMap(placeId: number, map: Map) {
    if (!(await this.placeRepository.existById(placeId))) {
      throw new InvalidPlaceToMapException(placeId);
    }

    if (map.hasPlace(placeId)) {
      throw new DuplicatePlaceToMapException(placeId);
    }
  }
}
