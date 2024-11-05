import { Body, Controller, Post } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/CreatePlaceDto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Post()
  async addPlace(@Body() createPlaceDto: CreatePlaceDto) {
    return this.placeService.addPlace(createPlaceDto);
  }
}
