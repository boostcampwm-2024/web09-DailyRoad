import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateBannerDetailsRequest {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  redirectUrl: string;
}
