import { IsUrl, IsDateString } from 'class-validator';

export class CreateBannerRequest {
  @IsUrl()
  imageUrl: string;

  @IsUrl()
  redirectUrl: string;

  @IsDateString()
  startedAt: Date;

  @IsDateString()
  endedAt: Date;
}
