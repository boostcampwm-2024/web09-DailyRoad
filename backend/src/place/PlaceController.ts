import {
  Controller,
  Get,
  Query,
  UseGuards,
  BadRequestException,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PlaceService } from '@src/place/PlaceService';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { AddPlaceRequest } from '@src/place/dto/AddPlaceRequest';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
import { UnavailableIn } from '@src/common/decorator/UnavaliableIn';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UnavailableIn('lightweight')
  async addPlace(@Body() addPlaceRequest: AddPlaceRequest) {
    return this.placeService.savePlace(addPlaceRequest);
  }

  @Throttle({
    default: {
      limit: 60,
      ttl: 60000,
      getTracker: () => 'global',
      generateKey: () => 'global',
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('/search')
  @UnavailableIn('lightweight')
  async searchPlacesToAdd(@Query('query') query: string) {
    if (!query) throw new BadRequestException('검색어를 입력해 주세요.');

    return this.placeService.searchPlacesInGoogle(query);
  }

  @Get()
  async searchAvailablePlaces(
    @Query('query') query?: string,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(5)) limit?: number,
  ) {
    if (!query) throw new BadRequestException('검색어를 입력해 주세요.');

    return this.placeService.getPlaces(query, page, limit);
  }

  @Get('/:id')
  async getPlaceDetail(@Param('id') id: number) {
    return this.placeService.getPlace(id);
  }
}
