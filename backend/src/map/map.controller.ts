import { Controller, Get, Post, Body, Query, Delete, Param } from '@nestjs/common';
import { MapService } from './map.service';
@Controller('/maps')
export class MapController {
  constructor(private readonly appService: MapService) {
  }

  @Get()
  async getMapList(@Query('query') query?: string) {
    return await this.appService.searchMap(query);
  }

  @Get('/my')
  async getMyMapList() {
    const userId = 1; // Todo. 로그인 기능 완성 후 수정
    return await this.appService.getOwnMaps(userId);
  }
