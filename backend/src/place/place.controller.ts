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
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';

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
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(5)) limit?: number,
  ) {
    return this.placeService.getPlaces(query, page, limit);
  }

  @Get('/:id')
  async getPlace(@Param('id') id: number) {
    return this.placeService.getPlace(id);
  }
}
