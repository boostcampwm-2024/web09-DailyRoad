import { IsDate, IsNotEmpty } from 'class-validator';

export class UpdateBannerPeriodRequest {
  @IsDate()
  @IsNotEmpty()
  startedAt: Date;

  @IsDate()
  @IsNotEmpty()
  endedAt: Date;
}
