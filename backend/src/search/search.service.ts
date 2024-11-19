import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PlaceSearchResponse } from '@src/search/dto/PlaceSearchResponse';
import { PlaceSearchHit } from '@src/search/search.type';

@Injectable()
export class SearchService {
  private readonly PLACE_INDEX = 'place';
  private readonly PLACE_ANALYZER = 'nori_with_synonym';

  constructor(private readonly esService: ElasticsearchService) {}

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
    let result = [];

    const searched = await this.esService.search({
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
    if (searched.hits?.hits.length === 0) {
      const prefixSearched = await this.esService.search({
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
      result = prefixSearched.hits?.hits || [];
    } else {
      result = searched.hits?.hits || [];
    }
    return {
      places: result.map((hit: PlaceSearchHit) => {
        const { _source } = hit;
        const {
          id,
          name,
          location,
          googlePlaceId,
          category,
          description,
          detailPageUrl,
          thumbnailUrl,
          rating,
          formattedAddress,
        } = _source;

        return new PlaceSearchResponse(
          id,
          name,
          location ? { latitude: location.lat, longitude: location.lon } : null,
          googlePlaceId,
          category,
          description,
          detailPageUrl,
          thumbnailUrl,
          rating,
          formattedAddress,
        );
      }),
      total_count: result.length,
    };
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
