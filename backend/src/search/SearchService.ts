import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PlaceSearchResponse } from '@src/search/dto/PlaceSearchResponse';
import { PinoLogger } from 'nestjs-pino';
import { ElasticSearchConfig } from '@src/config/ElasticSearchConfig';
import {
  isCompletionSuggest,
  PlaceAutocompleteSource,
  PlaceSearchHit,
} from '@src/search/type';
import { ElasticSearchQuery } from '@src/search/query/ElasticSearchQuery';
import { ElasticSearchSaveException } from '@src/search/exception/ElasticSearchSaveException';
import { SavePlaceToElasticSearchDTO } from '@src/search/dto/SavePlaceToElasticSearchDTO';
import { Place } from '@src/place/entity/PlaceEntity';
import { Category } from '@src/place/enum/Category';
import { PlaceService } from '@src/place/PlaceService';

@Injectable()
export class SearchService {
  constructor(
    private readonly elasticSearchQuery: ElasticSearchQuery,
    private readonly elasticSearchService: ElasticsearchService,
    @Inject(forwardRef(() => PlaceService))
    private readonly placeService: PlaceService,
    private readonly logger: PinoLogger,
  ) {}

  async savePlace(place: Place): Promise<void> {
    const data = SavePlaceToElasticSearchDTO.from(place);
    try {
      await this.elasticSearchService.index({
        index: ElasticSearchConfig.PLACE_INDEX,
        id: `${place.id}`,
        document: data,
      });
    } catch (error) {
      this.logger.error(
        `Elasticsearch에 장소 저장 중 에러가 발생했습니다: ${error}`,
      );
      throw new ElasticSearchSaveException(place.id);
    }
  }

  async searchPlace(
    query: string,
    latitude?: number,
    longitude?: number,
    page: number = 1,
    size: number = 5,
  ) {
    try {
      const searched = await this.elasticSearchQuery.searchPlace(
        query,
        latitude,
        longitude,
        page,
        size,
      );
      let result = searched.hits?.hits || [];
      if (result.length === 0) {
        const prefixSearched =
          await this.elasticSearchQuery.searchPlaceWithPrefix(query);
        result = prefixSearched.hits?.hits || [];
      }
      return result.map((hit: PlaceSearchHit) => {
        const { _source } = hit;
        return new PlaceSearchResponse(
          _source.id,
          _source.name,
          {
            latitude: _source.location.lat,
            longitude: _source.location.lon,
          },
          _source.googlePlaceId,
          _source.category as Category,
          _source.description,
          _source.detailPageUrl,
          _source.thumbnailUrl,
          _source.rating,
          _source.formattedAddress,
        );
      });
    } catch (error) {
      this.logger.error(
        `Elasticsearch 장소 검색 중 에러로 인해 DB에서 검색합니다.: ${error}`,
      );
      return await this.placeService.getPlaces(query, page, size);
    }
  }

  async syncPlaceToElasticSearch(places: Place[]) {
    const bulkOperations = [];

    places.forEach((place: Place) => {
      const esPlaceDto = {
        id: place.id,
        name: place.name,
        location: {
          lat: place.latitude,
          lon: place.longitude,
        },
        googlePlaceId: place.googlePlaceId,
        category: place.category,
        description: place.description,
        detailPageUrl: place.detailPageUrl,
        thumbnailUrl: place.thumbnailUrl,
        rating: place.rating,
        formattedAddress: place.formattedAddress,
        createdAt: place.createdAt.toISOString(),
        updatedAt: place.updatedAt.toISOString(),
        deletedAt: place.deletedAt?.toISOString() || null,
      };
      bulkOperations.push(
        { update: { _index: ElasticSearchConfig.PLACE_INDEX, _id: place.id } },
        { doc: esPlaceDto, doc_as_upsert: true },
      );
    });

    if (bulkOperations.length <= 0) {
      this.logger.debug(`동기화할 장소가 없습니다.`);
      return;
    }
    const response = await this.elasticSearchService.bulk({
      operations: bulkOperations,
    });

    this.logger.debug(
      `Elasticsearch에 동기화된 장소의 갯수: ${response.items.length}`,
    );
  }

  async autocompletePlace(query: string) {
    try {
      const response =
        await this.elasticSearchQuery.suggestPlaceQueryWithPrefix(query);

      const { names, addresses } = {
        names: this.extractSuggestions(response.suggest?.place_suggest),
        addresses: this.extractSuggestions(response.suggest?.address_suggest),
      };

      return this.removeDuplicates([...names, ...addresses]);
    } catch (error) {
      this.logger.error(`Elasticsearch 자동완성 요청 중 에러: ${error}`);
      return [];
    }
  }

  private extractSuggestions(suggestions: any): string[] {
    if (!Array.isArray(suggestions?.[0]?.options)) {
      return [];
    }

    const options = suggestions[0].options;

    return isCompletionSuggest<PlaceAutocompleteSource>(options)
      ? options
          .map(
            (option) =>
              option._source?.name || option._source?.formattedAddress,
          )
          .filter(Boolean)
      : [];
  }

  private removeDuplicates(items: string[]): string[] {
    return Array.from(new Set(items));
  }
}
