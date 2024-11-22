import { Injectable } from '@nestjs/common';
import { PlaceSearchResponse } from '@src/search/dto/PlaceSearchResponse';
import { PlaceSearchHit } from '@src/search/search.type';
import { ElasticSearchQuery } from '@src/search/query/ElasticSearchQuery';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticSearchException } from '@src/search/exception/ElasticSearchException';
import { Place } from '@src/place/entity/place.entity';
import { ESPlaceSaveDTO } from '@src/search/dto/ESPlaceSaveDTO';
import { ElasticSearchConfig } from '@src/config/ElasticSearchConfig';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticSearchQuery: ElasticSearchQuery,
    private readonly elasticSearchService: ElasticsearchService,
  ) {}

  async savePlace(place: Place): Promise<void> {
    const data = ESPlaceSaveDTO.from(place);
    try {
      await this.elasticSearchService.index({
        index: ElasticSearchConfig.PLACE_INDEX,
        id: `${place.id}`,
        document: data,
      });
    } catch (e) {
      throw new ElasticSearchException(place.id);
    }
  }

  async searchPlace(
    query: string,
    lat?: number,
    long?: number,
    page: number = 1,
    size: number = 10,
  ) {
    const searched = await this.elasticSearchQuery.searchPlace(
      query,
      lat,
      long,
      page,
      size,
    );
    let result = searched.hits?.hits || [];
    if (result.length === 0) {
      const prefixSearched =
        await this.elasticSearchQuery.searchPlaceWithPrefix(query);
      result = prefixSearched.hits?.hits || [];
    }
    return {
      places: result.map((hit: PlaceSearchHit) => {
        const { _source } = hit;
        return new PlaceSearchResponse(
          _source.id,
          _source.name,
          _source.location
            ? {
                latitude: _source.location.lat,
                longitude: _source.location.long,
              }
            : null,
          _source.googlePlaceId,
          _source.category,
          _source.description,
          _source.detailPageUrl,
          _source.thumbnailUrl,
          _source.rating,
          _source.formattedAddress,
        );
      }),
      total_count: result.length,
    };
  }
}
