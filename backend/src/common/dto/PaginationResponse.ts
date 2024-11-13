export abstract class PaginationResponse {
  readonly totalPages: number;
  readonly currentPage: number;

  protected constructor(
    totalCount: number,
    pageSize: number,
    currentPage: number,
  ) {
    this.totalPages = Math.ceil(totalCount / pageSize);
    this.currentPage = currentPage;
  }
}
