import { Banner } from '@src/banner/entity/Banner';

export class ActiveBannerListResponse {
  constructor(
    readonly id: number,
    readonly imageUrl: string,
    readonly redirectUrl: string,
    readonly startedAt: Date,
    readonly endedAt: Date,
  ) {}

  static from(banner: Banner[]): ActiveBannerListResponse[] {
    return banner.map((banner) => {
      return new ActiveBannerListResponse(
        banner.id,
        banner.imageUrl,
        banner.redirectUrl,
        banner.startedAt,
        banner.endedAt,
      );
    });
  }
}
