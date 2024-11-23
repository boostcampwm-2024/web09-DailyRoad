import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticSearchConfig } from '@src/config/ElasticSearchConfig';
import { Injectable } from '@nestjs/common';
import { ElasticSearchQueryBuilder } from '@src/search/query/builder/ElasticSearchQueryBuilder';

@Injectable()
export class ElasticSearchQuery {
  constructor(private readonly esService: ElasticsearchService) {}

  async searchPlace(
    query: string,
    latitude?: number,
    longitude?: number,
    page: number = 1,
    size: number = 10,
  ) {
    const tokens = await this.tokenizeQuery(query);
    const location =
      !isNaN(latitude) && !isNaN(longitude)
        ? {
            latitude: latitude,
            longitude: longitude,
          }
        : null;
    const from = (page - 1) * size;
    return await this.esService.search({
      index: ElasticSearchConfig.PLACE_INDEX,
      from,
      size,
      query: {
        function_score: {
          query: {
            bool: {
              should: [
                // 완전 일치
                ElasticSearchQueryBuilder.MATCH_NAME(query),
                // name에 대한 토큰 매칭
                ...tokens.map((token) =>
                  ElasticSearchQueryBuilder.MATCH_NAME(token),
                ),
                // formattedAddress에 대한 토큰 매칭
                ...tokens.map((token) =>
                  ElasticSearchQueryBuilder.MATCH_FORMATTED_ADDRESS(token),
                ),
              ],
            },
          },
          boost_mode: 'sum',
          score_mode: 'sum',
          functions: [
            // 완전 일치에 가중치 조정
            ElasticSearchQueryBuilder.FILTER_TERM_NAME_KEYWORD(query),
            // name의 토큰 매칭 가중치
            ...tokens.map((token) =>
              ElasticSearchQueryBuilder.FILTER_MATCH_NAME(token),
            ),
            // formattedAddress의 토큰 매칭 가중치
            ...tokens.map((token) =>
              ElasticSearchQueryBuilder.FILTER_MATCH_FORMATTED_ADDRESS(token),
            ),
            // 위치 정보 가중치
            ...(location
              ? [
                  ElasticSearchQueryBuilder.GAUSS_LOCATION(
                    location.latitude,
                    location.longitude,
                  ),
                ]
              : []),
          ],
        },
      },
    });
  }

  async searchPlaceWithPrefix(query: string) {
    return await this.esService.search({
      index: ElasticSearchConfig.PLACE_INDEX,
      query: {
        bool: {
          should: [
            ElasticSearchQueryBuilder.PREFIX_NAME(query),
            ElasticSearchQueryBuilder.PREFIX_FORMATTED_ADDRESS(query),
          ],
        },
      },
    });
  }

  private async tokenizeQuery(query: string): Promise<string[]> {
    const analysis = await this.esService.indices.analyze({
      index: ElasticSearchConfig.PLACE_INDEX,
      analyzer: ElasticSearchConfig.PLACE_ANALYZER,
      text: query,
    });
    return analysis.tokens?.map((token) => token.token) || [];
  }
}
