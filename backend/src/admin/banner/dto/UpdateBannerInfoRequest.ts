import { IsUrl } from 'class-validator';

export class UpdateBannerInfoRequest {
  @IsUrl()
  imageUrl: string;

  @IsUrl()
  redirectUrl: string;
}
