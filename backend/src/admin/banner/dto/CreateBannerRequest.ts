import { IsNotEmpty, IsString, IsUrl, IsDate } from 'class-validator';

export class CreateBannerRequest {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  redirectUrl: string;

  @IsDate()
  @IsNotEmpty()
  startedAt: Date;

  @IsDate()
  @IsNotEmpty()
  endedAt: Date;
}
