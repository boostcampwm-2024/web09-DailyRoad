import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapRequest } from './dto/CreateMapRequest';
import { UpdateMapInfoRequest } from './dto/UpdateMapInfoRequest';

@Controller('/maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async getMapList(@Query('query') query?: string) {
    return await this.mapService.searchMap(query);
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

  @Patch('/:id/info')
  async updateMapInfo(
    @Param('id') id: number,
    @Body() updateMapInfoRequest: UpdateMapInfoRequest,
  ) {
    await this.mapService.updateMapInfo(id, updateMapInfoRequest);
    return { id, ...updateMapInfoRequest };
  }

  @Patch('/:id/visibility')
  async updateMapVisibility(
    @Param('id') id: number,
    @Body('isPublic') isPublic: boolean,
  ) {
    await this.mapService.updateMapVisibility(id, isPublic);
    return { id, isPublic };
  }

  @Delete('/:id')
  async deleteMap(@Param('id') id: number) {
    return await this.mapService.deleteMap(id);
  }
}
