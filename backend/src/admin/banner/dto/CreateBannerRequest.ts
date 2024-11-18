import { IsUrl, IsDate } from 'class-validator';

export class CreateBannerRequest {
  @IsUrl()
  imageUrl: string;

  @IsUrl()
  redirectUrl: string;

  @IsDate()
  startedAt: Date;

  @IsDate()
  endedAt: Date;
}
