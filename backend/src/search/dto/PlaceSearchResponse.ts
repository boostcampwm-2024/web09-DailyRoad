export class PlaceSearchResponse {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly location: {
      readonly latitude: number;
      readonly longitude: number;
    },
    readonly google_place_id: string,
    readonly category?: string,
    readonly description?: string,
    readonly detail_page_url?: string,
    readonly thumbnail_url?: string,
    readonly rating?: number,
    readonly formed_address?: string,
  ) {}
}
