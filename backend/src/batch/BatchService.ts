import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlaceRepository } from '@src/place/PlaceRepository';
import { SearchService } from '@src/search/SearchService';

@Injectable()
export class BatchService {
  constructor(
    private readonly searchService: SearchService,
    private readonly placeRepository: PlaceRepository,
    private readonly logger: PinoLogger,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async syncPlacesToElastic() {
    this.logger.debug(`syncPlacesToElastic() 배치 시작`);
    try {
      this.logger.debug(`동기화 작업을 시작합니다.`);
      const places = await this.placeRepository.findUpdatedPlacesForTwoHours();
      this.logger.debug(`동기화 할 장소의 갯수: ${places.length}`);

      await this.searchService.syncPlaceToElasticSearch(places);
      this.logger.debug(`동기화 작업이 완료되었습니다.`);
    } catch (error) {
      this.logger.error(`동기화 작업 중 에러가 발생했습니다: ${error}`);
    } finally {
      this.logger.debug(`syncPlacesToElastic() 배치 종료`);
    }
  }
}
