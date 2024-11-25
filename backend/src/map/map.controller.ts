import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapRequest } from './dto/CreateMapRequest';
import { UpdateMapInfoRequest } from './dto/UpdateMapInfoRequest';
import { AddPlaceToMapRequest } from './dto/AddPlaceToMapRequest';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';

@Controller('/maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async getMapList(
    @Query('query') query?: string,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(10)) limit?: number,
  ) {
    return await this.mapService.searchMap(query, page, limit);
  }

  @Get('/my')
  async getMyMapList() {
    const userId = 1; // Todo. 로그인 기능 완성 후 수정
    return await this.mapService.getOwnMaps(userId);
  }

  @Get('/:id')
  async getMapDetail(@Param('id') id: number) {
    return await this.mapService.getMapById(id);
  }

  @Post()
  async createMap(@Body() createMapRequest: CreateMapRequest) {
    const userId = 1; // Todo. 로그인 기능 완성 후 수정
    return await this.mapService.createMap(userId, createMapRequest);
  }

  @Post('/:id/places')
  async addPlaceToMap(
    @Param('id') id: number,
    @Body() addPlaceToMapRequest: AddPlaceToMapRequest,
  ) {
    const { placeId, color, comment } = addPlaceToMapRequest;
    return await this.mapService.addPlace(id, placeId, color, comment);
  }

  @Delete('/:id/places/:placeId')
  async deletePlaceFromMap(
    @Param('id') id: number,
    @Param('placeId') placeId: number,
  ) {
    return await this.mapService.deletePlace(id, placeId);
  }

  @Patch('/:id/info')
  async updateMapInfo(
    @Param('id') id: number,
    @Body() updateMapInfoRequest: UpdateMapInfoRequest,
  ) {
    if (updateMapInfoRequest.isEmpty()) {
      throw new BadRequestException('수정할 정보가 없습니다.');
    }

    await this.mapService.updateMapInfo(id, updateMapInfoRequest);
    return { id, ...updateMapInfoRequest };
  }

  @Patch('/:id/visibility')
  async updateMapVisibility(
    @Param('id') id: number,
    @Body('isPublic') isPublic: boolean,
  ) {
    if (typeof isPublic !== 'boolean') {
      throw new BadRequestException('공개 여부는 boolean 타입이어야 합니다.');
    }

    await this.mapService.updateMapVisibility(id, isPublic);
    return { id, isPublic };
  }

  @Delete('/:id')
  async deleteMap(@Param('id') id: number) {
    return await this.mapService.deleteMap(id);
  }
}
