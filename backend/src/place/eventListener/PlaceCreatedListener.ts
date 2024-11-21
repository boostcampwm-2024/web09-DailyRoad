import { Injectable } from '@nestjs/common';
import { SearchService } from '@src/search/search.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Place } from '@src/place/entity/place.entity';

@Injectable()
export class PlaceCreatedListener {
  constructor(private readonly searchService: SearchService) {}

  @OnEvent('place.created')
  async handlePlaceCreatedEvent(place: Place) {
    await this.searchService.savePlace(place);
  }
}
