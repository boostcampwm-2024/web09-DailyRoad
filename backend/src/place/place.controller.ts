import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceRequest } from './dto/CreatePlaceRequest';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  async addPlace(@Body() createPlaceDto: CreatePlaceRequest) {
    return this.placeService.addPlace(createPlaceDto);
  }

  @Get()
  async getPlaces(@Query('query') query?: string) {
    return this.placeService.getPlaces(query);
  }

  @Get('/:id')
  async getPlace(@Param('id') id: number) {
    return this.placeService.getPlace(id);
  }
}
