import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Post,
  Body,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { Throttle } from '@nestjs/throttler';
import { CreatePlaceRequest } from '@src/place/dto/CreatePlaceRequest';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post()
  async importPlace(@Body() createPlaceDto: CreatePlaceRequest) {
    return this.placeService.addPlace(createPlaceDto);
  }

  // Todo. 커스텀 스로틀러 구현
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
    return this.placeService.getPlaces(query, page, limit);
  }

  @Get('/:id')
  async getSinglePlace(@Param('id') id: number) {
    return this.placeService.getPlace(id);
  }
}
