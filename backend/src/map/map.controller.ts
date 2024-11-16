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
  Put,
  UseGuards,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapRequest } from './dto/CreateMapRequest';
import { UpdateMapInfoRequest } from './dto/UpdateMapInfoRequest';
import { AddPlaceToMapRequest } from './dto/AddPlaceToMapRequest';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
import { UpdatePlaceInMapRequest } from '@src/map/dto/UpdatePlaceInMapRequest';
import { EmptyRequestException } from '@src/common/exception/EmptyRequestException';
import { AuthUser } from '@src/auth/AuthUser.decorator';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';

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

  @UseGuards(JwtAuthGuard)
  @Get('/my')
  async getMyMapList(@AuthUser() user: AuthUser) {
    return await this.mapService.getOwnMaps(user.userId);
  }

  @Get('/:id')
  async getMapDetail(@Param('id') id: number) {
    return await this.mapService.getMapById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMap(
    @Body() createMapRequest: CreateMapRequest,
    @AuthUser() user: AuthUser,
  ) {
    return await this.mapService.createMap(user.userId, createMapRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/places')
  async addPlaceToMap(
    @Param('id') id: number,
    @Body() addPlaceToMapRequest: AddPlaceToMapRequest,
  ) {
    const { placeId, color, comment } = addPlaceToMapRequest;
    return await this.mapService.addPlace(id, placeId, color, comment);
  }

  @Put('/:id/places/:placeId')
  async updatePlaceInMap(
    @Param('id') id: number,
    @Param('placeId') placeId: number,
    @Body() updatePlaceInMapRequest: UpdatePlaceInMapRequest,
  ) {
    if (updatePlaceInMapRequest.isEmpty()) {
      throw new EmptyRequestException('수정');
    }
    const { color, comment } = updatePlaceInMapRequest;

    await this.mapService.updatePlace(id, placeId, color, comment);
    return { mapId: id, placeId, color, comment };
  }

  @UseGuards(JwtAuthGuard)
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
      throw new EmptyRequestException('수정');
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
