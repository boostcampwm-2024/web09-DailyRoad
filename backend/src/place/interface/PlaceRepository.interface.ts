import { Place } from '../entity/place.entity';
import { SoftDeletable } from '../../common/SoftDeletable';

export abstract class PlaceRepository extends SoftDeletable<Place, number> {
  abstract save(place: Place): Promise<Place>;

  abstract findAll(page: number, pageSize: number): Promise<Place[]>;

  abstract findByGooglePlaceId(
    googlePlaceId: string,
  ): Promise<Place | undefined>;

  abstract searchByNameOrAddressQuery(
    query: string,
    page: number,
    pageSize: number,
  ): Promise<Place[]>;
}
