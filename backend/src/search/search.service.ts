import { Injectable } from '@nestjs/common';
import { PlaceRepository } from '@src/place/place.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SearchService {
  private readonly PLACE_INDEX = 'place';
  private readonly PLACE_ANALYZER = 'nori_with_synonym';

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
      const data = {
        ...place,
        location: {
          lat: place.latitude,
          lon: place.longitude,
        },
      };
      delete data.latitude;
      delete data.longitude;

      await this.indexData(this.PLACE_INDEX, data);
    }
    const endTime = new Date().toISOString();
    this.logger.info(`Indexing 완료: ${endTime}`);
    this.logger.info(
      `소요 시간: ${new Date(endTime).getTime() - new Date(startTime).getTime()}ms`,
    );
  }

  async search(
    query: string,
    lat?: number,
    lon?: number,
    page: number = 1,
    size: number = 10,
  ) {
    const from = (page - 1) * size;
    const tokens = await this.tokenizeQuery(query);
    const location = !isNaN(lat) && !isNaN(lon) ? { lat, lon } : null;

    const result = await this.esService.search({
      index: 'place',
      from,
      size,
      query: {
        function_score: {
          query: {
            bool: {
              should: [
                // 완전 일치
                {
                  match: {
                    name: {
                      query: query,
                      fuzziness: 1,
                    },
                  },
                },
                // name에 대한 토큰 매칭
                ...tokens.map((token) => ({
                  match: {
                    name: {
                      query: token,
                      fuzziness: 1,
                    },
                  },
                })),
                // formattedAddress에 대한 토큰 매칭
                ...tokens.map((token) => ({
                  match: {
                    formattedAddress: {
                      query: token,
                      fuzziness: 1,
                    },
                  },
                })),
              ],
            },
          },
          boost_mode: 'sum',
          score_mode: 'sum',
          functions: [
            // 완전 일치에 가중치 조정
            {
              filter: { term: { 'name.keyword': query } },
              weight: 20,
            },
            // name의 토큰 매칭 가중치
            ...tokens.map((token) => ({
              filter: { match: { name: token } },
              weight: 15,
            })),
            // formattedAddress의 토큰 매칭 가중치
            ...tokens.map((token) => ({
              filter: { match: { formattedAddress: token } },
              weight: 10,
            })),
            // 위치 정보 가중치
            ...(location
              ? [
                  {
                    gauss: {
                      location: {
                        origin: `${location.lat},${location.lon}`,
                        scale: '10km',
                        offset: '2km',
                        decay: 0.5,
                      },
                    },
                    weight: 20,
                  },
                ]
              : []),
          ],
        },
      },
    });

    // 결과가 없으면 prefix 검색 (name, formattedAddress)
    if (result.hits?.hits.length === 0) {
      const prefixResult = await this.esService.search({
        index: 'place',
        query: {
          bool: {
            should: [
              {
                prefix: {
                  name: {
                    value: query,
                  },
                },
              },
              {
                prefix: {
                  formattedAddress: {
                    value: query,
                  },
                },
              },
            ],
          },
        },
      });
      return prefixResult.hits?.hits || [];
    }

    return result.hits?.hits || [];
  }

  private async tokenizeQuery(query: string): Promise<string[]> {
    const analysis = await this.esService.indices.analyze({
      index: this.PLACE_INDEX,
      analyzer: this.PLACE_ANALYZER,
      text: query,
    });
    return analysis.tokens?.map((token) => token.token) || [];
  }
}
