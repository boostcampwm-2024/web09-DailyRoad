import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '@src/search/search.service';
import { ParseOptionalNumberPipe } from '@src/common/pipe/ParseOptionalNumberPipe';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('query') query: string,
    @Query('lat') lat?: number,
    @Query('long') long?: number,
    @Query('page', new ParseOptionalNumberPipe(1)) page?: number,
    @Query('limit', new ParseOptionalNumberPipe(10)) limit?: number,
  ) {
    return await this.searchService.search(query, lat, long, page, limit);
  }
}
