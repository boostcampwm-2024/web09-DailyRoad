import { IsUrl } from 'class-validator';

export class UpdateBannerDetailsRequest {
  @IsUrl()
  imageUrl: string;

  @IsUrl()
  redirectUrl: string;
}
