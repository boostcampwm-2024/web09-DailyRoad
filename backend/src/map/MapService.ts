import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { Map } from '@src/map/entity/Map';
import { MapRepository } from '@src/map/MapRepository';
import { MapListResponse } from '@src/map/dto/MapListResponse';
import { MapDetailResponse } from '@src/map/dto/MapDetailResponse';
import { PagedMapResponse } from '@src/map/dto/PagedMapResponse';
import { UpdateMapInfoRequest } from '@src/map/dto/UpdateMapInfoRequest';
import { CreateMapRequest } from '@src/map/dto/CreateMapRequest';
import { MapNotFoundException } from '@src/map/exception/MapNotFoundException';
import { DuplicatePlaceToMapException } from '@src/map/exception/DuplicatePlaceToMapException';
import { InvalidPlaceToMapException } from '@src/map/exception/InvalidPlaceToMapException';
import { User } from '@src/user/entity/User';
import { PlaceRepository } from '@src/place/PlaceRepository';
import { AddPinToMapRequest } from '@src/map/dto/AddPinToMapRequest';
import { UpdatePinInfoInMapRequest } from '@src/map/dto/UpdatePinInfoInMapRequest';
import { UpdateMapVisibilityRequest } from '@src/map/dto/UpdateMapVisibilityRequest';

@Injectable()
export class MapService {
  constructor(
    private readonly mapRepository: MapRepository,
    private readonly placeRepository: PlaceRepository,
  ) {}

  async searchMaps(query?: string, page: number = 1, pageSize: number = 15) {
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

  async getMyMaps(userId: number, page: number = 1, pageSize: number = 10) {
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

  async getMap(id: number) {
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

  async updateInfo(id: number, updateMapForm: UpdateMapInfoRequest) {
    await this.checkExists(id);

    const { title, description } = updateMapForm;
    return this.mapRepository.update(id, { title, description });
  }

  async updateMapVisibility(
    id: number,
    visibility: UpdateMapVisibilityRequest,
  ) {
    await this.checkExists(id);
    return this.mapRepository.update(id, { isPublic: visibility.isPublic });
  }

  async addPin(id: number, pinInfo: AddPinToMapRequest) {
    const { placeId, color, comment } = pinInfo;
    const map = await this.mapRepository.findById(id);
    if (!map) throw new MapNotFoundException(id);
    await this.validatePlacesForMap(placeId, map);

    map.addPin(placeId, color, comment);
    await this.mapRepository.save(map);

    return {
      comment,
      color,
      placeId: placeId,
    };
  }

  @Transactional()
  async updatePin(
    id: number,
    placeId: number,
    pinInfo: UpdatePinInfoInMapRequest,
  ) {
    const { color, comment } = pinInfo;
    const map = await this.getMapOrElseThrowNotFound(id);
    map.updatePin(placeId, color, comment);

    return this.mapRepository.save(map);
  }

  async deletePin(id: number, placeId: number) {
    const map = await this.getMapOrElseThrowNotFound(id);

    map.deletePin(placeId);
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
