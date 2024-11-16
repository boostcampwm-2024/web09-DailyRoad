import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '@src/search/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('query') query: string) {
    return await this.searchService.search(query);
  }

  @Get('index/place')
  async indexPlace() {
    return await this.searchService.indexPlace();
  }
}
