import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MapService } from './MapService';
import { CreateMapRequest } from './dto/CreateMapRequest';
import { UpdateMapInfoRequest } from './dto/UpdateMapInfoRequest';
import { AddPlaceToMapRequest } from './dto/AddPlaceToMapRequest';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
import { UpdatePlaceInMapRequest } from '@src/map/dto/UpdatePlaceInMapRequest';
import { EmptyRequestException } from '@src/common/exception/EmptyRequestException';
import { AuthUser } from '@src/auth/decortator/AuthUser';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { MapPermissionGuard } from '@src/map/guards/MapPermissionGuard';
import { UpdateMapVisibilityRequest } from '@src/map/dto/UpdateMapVisibilityRequest';

@Controller('/maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  async getMapList(
    @Query('query') query?: string,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(15)) limit?: number,
  ) {
    if (query) {
      return await this.mapService.searchMap(query, page, limit);
    }
    return await this.mapService.getAllMaps(page, limit);
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

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Post('/:id/places')
  async addPlaceToMap(
    @Param('id') id: number,
    @Body() addPlaceToMapRequest: AddPlaceToMapRequest,
  ) {
    const { placeId, color, comment } = addPlaceToMapRequest;
    return await this.mapService.addPlace(id, placeId, color, comment);
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
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

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Delete('/:id/places/:placeId')
  async deletePlaceFromMap(
    @Param('id') id: number,
    @Param('placeId') placeId: number,
  ) {
    return await this.mapService.deletePlace(id, placeId);
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
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

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Patch('/:id/visibility')
  async updateMapVisibility(
    @Param('id') id: number,
    @Body() updateMapVisibilityRequest: UpdateMapVisibilityRequest,
  ) {
    await this.mapService.updateMapVisibility(
      id,
      updateMapVisibilityRequest.isPublic,
    );
    return { id, isPublic: updateMapVisibilityRequest.isPublic };
  }

  @UseGuards(JwtAuthGuard, MapPermissionGuard)
  @Delete('/:id')
  async deleteMap(@Param('id') id: number) {
    return await this.mapService.deleteMap(id);
  }
}
