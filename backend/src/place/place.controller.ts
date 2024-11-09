import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceRequest } from './dto/CreatePlaceRequest';
import { JwtAuthGuard } from '../auth/JwtAuthGuard';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPlace(@Body() createPlaceDto: CreatePlaceRequest) {
    return this.placeService.addPlace(createPlaceDto);
  }

  @Get()
  async getPlaces(
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    if (isNaN(page)) page = 1; // Todo. number 타입 선택적 매개변수일 때 NaN 으로 처리되어 추가. 다른 방법?
    if (isNaN(limit)) limit = 5;

    return this.placeService.getPlaces(query, page, limit);
  }

  @Get('/:id')
  async getPlace(@Param('id') id: number) {
    return this.placeService.getPlace(id);
  }
}
