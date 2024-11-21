import { BadGatewayException, Injectable } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { CreatePlaceRequest } from './dto/CreatePlaceRequest';
import { PlaceNotFoundException } from './exception/PlaceNotFoundException';
import { PlaceAlreadyExistsException } from './exception/PlaceAlreadyExistsException';
import { PlaceSearchResponse } from './dto/PlaceSearchResponse';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class PlaceService {
  readonly GOOGLE_PLACE_DETAIL_BASE_URL = `https://www.google.com/maps/place/`;
  readonly GOOGLE_PLACE_PHOTO_BASE_URL = `https://maps.googleapis.com/maps/api/place/photo`;
  readonly GOOGLE_PLACE_SEARCH_BASE_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json`;
  readonly IN_KOREA_OPTIONS = `region=kr&language=ko`;
  private readonly GOOGLE_API_KEY: string;

  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.GOOGLE_API_KEY = this.configService.get(<string>'GOOGLE_MAPS_API_KEY');
  }

  @Transactional()
  async addPlace(createPlaceRequest: CreatePlaceRequest) {
    const { googlePlaceId } = createPlaceRequest;
    if (await this.placeRepository.findByGooglePlaceId(googlePlaceId)) {
      throw new PlaceAlreadyExistsException();
    }

    const place = createPlaceRequest.toEntity(
      createPlaceRequest.thumbnailUrl ||
        (await this.getGoogleThumbnailUrl(createPlaceRequest.photoReference)),
    );

    const savedPlace = await this.placeRepository.save(place);
    this.eventEmitter.emit('place.created', savedPlace);
    return { id: savedPlace.id };
  }

  async getPlaces(query?: string, page: number = 1, pageSize: number = 10) {
    const result = query
      ? await this.placeRepository.searchByNameOrAddressQuery(
          query,
          page,
          pageSize,
        )
      : await this.placeRepository.findAll(page, pageSize);

    return result.map(PlaceSearchResponse.from);
  }

  async getPlace(id: number) {
    const place = await this.placeRepository.findById(id);
    if (!place) throw new PlaceNotFoundException(id);

    return PlaceSearchResponse.from(place);
  }

  async searchPlacesInGoogle(query: string) {
    const url = `${this.GOOGLE_PLACE_SEARCH_BASE_URL}?query=${encodeURIComponent(
      query,
    )}&${this.IN_KOREA_OPTIONS}&key=${this.GOOGLE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok)
      throw new BadGatewayException('Google API 호출 중 오류가 발생했습니다.');

    const data = await response.json();
    return data.results.map((place) => this.formatGooglePlaceData(place));
  }

  private formatGooglePlaceData(place) {
    const {
      place_id,
      name,
      rating,
      geometry,
      formatted_address,
      types,
      photos,
    } = place;

    return {
      googlePlaceId: place_id,
      name: name,
      rating: rating || null,
      location: {
        longitude: geometry.location.lng,
        latitude: geometry.location.lat,
      },
      formattedAddress: formatted_address || null,
      category: types?.[0] || null,
      description: null,
      detailPageUrl: `${this.GOOGLE_PLACE_DETAIL_BASE_URL}?q=place_id:${place_id}`,
      photoReference: photos?.[0]?.photo_reference || null,
    };
  }

  private async getGoogleThumbnailUrl(
    photoReference: string,
  ): Promise<string | null> {
    if (!photoReference) return null;
    const url = `${this.GOOGLE_PLACE_PHOTO_BASE_URL}?maxwidth=1200&photoreference=${photoReference}&key=${this.GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (response.ok && response.url !== url) return response.url;

      return null;
    } catch (error) {
      throw new BadGatewayException(
        'Google API 호출 중 오류가 발생했습니다.' + error,
      );
    }
  }
}
