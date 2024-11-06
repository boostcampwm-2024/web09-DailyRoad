import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { Controller, Get, Post, Body, Query, Delete, Param, Patch } from '@nestjs/common';
import { MapService } from './map.service';
import { CreateMapRequest } from './dto/CreateMapRequest';
import { UpdateMapInfoRequest } from './dto/UpdateMapInfoRequest';

@Controller('/maps')
export class MapController {
  constructor(private readonly appService: MapService) {}

  @Get()
  async getMapList(@Query('query') query?: string) {
    return await this.appService.searchMap(query);
  }

  @Get('/my')
  async getMyMapList() {
    const userId = 1; // Todo. 로그인 기능 완성 후 수정
    return await this.appService.getOwnMaps(userId);
  }

  @Get('/:id')
  async getMapDetail(@Param('id') id: number) {
    return await this.appService.getMapById(id);
  }

  @Post()
  async createMap(@Body() createMapForm: CreateMapRequest) {
    const userId = 1; // Todo. 로그인 기능 완성 후 수정
    return await this.appService.createMap(userId, createMapForm);
  }

  @Delete('/:id')
  async deleteMap(@Param('id') id: number) {
    return await this.appService.deleteMap(id);
  }

  @Patch('/:id/info')
  async updateMapInfo(@Param('id') id: number, @Body() updateMapForm: UpdateMapInfoRequest) {
    await this.appService.updateMapInfo(id, updateMapForm);
    return { id, ...updateMapForm };
  }
}
