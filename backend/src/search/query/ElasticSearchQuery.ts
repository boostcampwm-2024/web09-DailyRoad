import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ESconfig } from '@src/config/ESconfig';

export class ElasticSearchQuery {
  constructor(private readonly esService: ElasticsearchService) {}

  async searchPlace(
    query: string,
    lat?: number,
    lon?: number,
    page: number = 1,
    size: number = 10,
  ) {
    const tokens = await this.tokenizeQuery(query);
    const location = !isNaN(lat) && !isNaN(lon) ? { lat, lon } : null;
    const from = (page - 1) * size;
    return await this.esService.search({
      index: ESconfig.PLACE_INDEX,
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
  }

  async searchPlaceWithPrefix(query: string) {
    return await this.esService.search({
      index: ESconfig.PLACE_INDEX,
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
  }

  private async tokenizeQuery(query: string): Promise<string[]> {
    const analysis = await this.esService.indices.analyze({
      index: ESconfig.PLACE_INDEX,
      analyzer: ESconfig.PLACE_ANALYZER,
      text: query,
    });
    return analysis.tokens?.map((token) => token.token) || [];
  }
}
