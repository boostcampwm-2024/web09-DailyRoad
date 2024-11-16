import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapRequest } from './dto/CreateMapRequest';
import { UpdateMapInfoRequest } from './dto/UpdateMapInfoRequest';
import { AddPlaceToMapRequest } from './dto/AddPlaceToMapRequest';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/places/:placeId')
  async deletePlaceFromMap(
    @Param('id') id: number,
    @Param('placeId') placeId: number,
  ) {
    return await this.mapService.deletePlace(id, placeId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/info')
  async updateMapInfo(
    @Param('id') id: number,
    @Body() updateMapInfoRequest: UpdateMapInfoRequest,
  ) {
    await this.mapService.updateMapInfo(id, updateMapInfoRequest);
    return { id, ...updateMapInfoRequest };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/visibility')
  async updateMapVisibility(
    @Param('id') id: number,
    @Body('isPublic') isPublic: boolean,
  ) {
    await this.mapService.updateMapVisibility(id, isPublic);
    return { id, isPublic };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteMap(@Param('id') id: number) {
    return await this.mapService.deleteMap(id);
  }
}
