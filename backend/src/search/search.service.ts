import { Injectable } from '@nestjs/common';
import { PlaceRepository } from '@src/place/place.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SearchService {
  constructor(
    private placeRepository: PlaceRepository,
    private readonly logger: PinoLogger,
    private readonly esService: ElasticsearchService,
  ) {}

  // 데이터를 인덱스(엘라스틱서치 형태로 주입)
  async indexData(indexName: string, data: any) {
    return await this.esService.index({
      index: indexName,
      document: data,
    });
  }

  async indexPlace() {
    const startTime = new Date().toISOString();
    this.logger.info(`Indexing 시작: ${startTime}`);
    const places = await this.placeRepository.find();
    for (const place of places) {
      await this.indexData('place', place);
    }
    const endTime = new Date().toISOString();
    this.logger.info(`Indexing 완료: ${endTime}`);
    this.logger.info(
      `소요 시간: ${new Date(endTime).getTime() - new Date(startTime).getTime()}ms`,
    );
  }

  async search(query: string) {
    const result = await this.esService.search({
      index: 'place',
      query: {
        multi_match: {
          query: query,
          fields: ['name'],
        },
      },
    });
    return result.hits?.hits || [];
  }
}
