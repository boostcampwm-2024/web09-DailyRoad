import { PaginationResponse } from '@src/common/dto/PaginationResponse';
import { MapListResponse } from '@src/map/dto/MapListResponse';

export class PagedMapResponse extends PaginationResponse {
  constructor(
    readonly maps: MapListResponse[],
    totalCount: number,
    currentPage: number,
    pageSize: number,
  ) {
    super(totalCount, pageSize, currentPage);
  }
}
