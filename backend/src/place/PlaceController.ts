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
import { PlaceService } from './PlaceService';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { Throttle } from '@nestjs/throttler';
import { CreatePlaceRequest } from '@src/place/dto/CreatePlaceRequest';
import { UnavailableIn } from '@src/common/decorator/UnavaliableIn';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UnavailableIn('lightweight')
  async importPlace(@Body() createPlaceDto: CreatePlaceRequest) {
    return this.placeService.addPlace(createPlaceDto);
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
  async searchPlacesToImport(@Query('query') query: string) {
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
  async getSinglePlace(@Param('id') id: number) {
    return this.placeService.getPlace(id);
  }
}
