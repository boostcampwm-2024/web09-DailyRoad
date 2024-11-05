import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/CreatePlaceDto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  async addPlace(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.addPlace(createPlaceDto);
  }

  @Get()
  async getPlaces() {
    return this.placeService.getPlaces();
  }

  @Get('/:id')
  async getPlace(@Param('id') id: number) {
    return this.placeService.getPlace(id);
  }
}
